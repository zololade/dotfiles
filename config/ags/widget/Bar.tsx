import { Variable, GLib, bind } from "astal";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import Mpris from "gi://AstalMpris";
import Battery from "gi://AstalBattery";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Tray from "gi://AstalTray";
import { interval } from "astal/time";
import { exec, execAsync } from "astal/process";
import { Variable } from "astal";

function IdleToggle() {
  const isIdleInhibited = Variable(true);
  const scriptPath = `/home/ololade/.config/ags/scripts/toggle_idle`;

  async function checkIdleStatus() {
    try {
      await execAsync(["pgrep", "-x", "hypridle"]);
      isIdleInhibited.set(true); // Process found
    } catch (e) {
      const eData = e;
      isIdleInhibited.set(false); // Process not found or error
    }
  }

  const toggleIdle = () => {
    exec([scriptPath]);
    isIdleInhibited.set(!isIdleInhibited.get());
    checkIdleStatus();
  };

  interval(2000, () => {
    checkIdleStatus();
  });

  return (
    <box className="IdleInhibitorClass">
      <button
        label={bind(isIdleInhibited).as((v) =>
          v ? "😴 Chill Mode" : "🔥 Stay Awake"
        )}
        onClicked={toggleIdle}
      />
    </box>
  );
}

function SysTray() {
  const tray = Tray.get_default();

  return (
    <box className="SysTray">
      {bind(tray, "items").as((items) => {
        if (items.length <= 6) {
          return items.map((item) => (
            <menubutton
              tooltipMarkup={bind(item, "tooltipMarkup")}
              usePopover={false}
              actionGroup={bind(item, "actionGroup").as((ag) => [
                "dbusmenu",
                ag,
              ])}
              menuModel={bind(item, "menuModel")}
            >
              <icon gicon={bind(item, "gicon")} />
            </menubutton>
          ));
        } else {
          return items.slice(0, 6).map((item) => (
            <menubutton
              tooltipMarkup={bind(item, "tooltipMarkup")}
              usePopover={false}
              actionGroup={bind(item, "actionGroup").as((ag) => [
                "dbusmenu",
                ag,
              ])}
              menuModel={bind(item, "menuModel")}
            >
              <icon gicon={bind(item, "gicon")} />
            </menubutton>
          ));
        }
      })}
    </box>
  );
}

function Wifi() {
  const network = Network.get_default();
  const wifi = bind(network, "wifi");

  return (
    <box visible={wifi.as(Boolean)} className="Wifi-pos">
      {wifi.as(
        (wifi) =>
          wifi && (
            <icon
              tooltipText={bind(wifi, "ssid").as(String)}
              className="Wifi"
              icon={bind(wifi, "iconName")}
            />
          )
      )}
    </box>
  );
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box className="AudioSlider" css="min-width: 140px">
      <icon icon={bind(speaker, "volumeIcon")} />
      <slider
        hexpand
        onDragged={({ value }) => (speaker.volume = value)}
        value={bind(speaker, "volume")}
      />
    </box>
  );
}

function BatteryLevel() {
  const bat = Battery.get_default();

  return (
    <box className="Battery" visible={bind(bat, "isPresent")}>
      <icon icon={bind(bat, "batteryIconName")} />
      <label
        label={bind(bat, "percentage").as(
          (p) => `${Math.floor(p * 100)} %`
        )}
      />
    </box>
  );
}

function Media() {
  const mpris = Mpris.get_default();

  return (
    <box className="Media">
      {bind(mpris, "players").as((ps) =>
        ps[0] ? (
          <box>
            {bind(ps[0], "coverArt").as((cover) =>
              cover ? (
                <box
                  className="Cover"
                  valign={Gtk.Align.CENTER}
                  css={`
                    background-image: url("${cover}");
                  `}
                />
              ) : (
                <></>
              )
            )}
            <label
              label={bind(ps[0], "metadata").as(() => {
                if (ps[0].title || ps[0].artist) {
                  const text = `${ps[0].title} - ${ps[0].artist}`;
                  return text.length > 20
                    ? text.slice(0, 20) + "…"
                    : text;
                } else {
                  return "Nothing Playing";
                }
              })}
            />
          </box>
        ) : (
          <label label="Media Offline" />
        )
      )}
    </box>
  );
}

function Workspaces() {
  const hypr = Hyprland.get_default();

  return (
    <box className="Workspaces">
      {bind(hypr, "workspaces").as((wss) =>
        wss
          .filter((ws) => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
          .sort((a, b) => a.id - b.id)
          .map((ws) => (
            <button
              className={bind(hypr, "focusedWorkspace").as((fw) =>
                ws === fw ? "focused" : ""
              )}
              onClicked={() => ws.focus()}
            >
              {ws.id}
            </button>
          ))
      )}
    </box>
  );
}

function FocusedClient() {
  const hypr = Hyprland.get_default();
  const focused = bind(hypr, "focusedClient");

  return (
    <box className="Focused" visible={focused.as(Boolean)}>
      {/*
        First we bind the focusedClient itself; whenever it changes,
        we reify a new subtree. Inside that, we bind client.class so
        we get notified _again_ as soon as the class string is set.
      */}
      {focused.as((client) =>
        client ? (
          <icon
            className="FocusedIcon"
            tooltipMarkup={bind(client, "class").as((str) =>
              str && str.length > 30
                ? str.slice(0, 30) + "…"
                : str ?? "Unknown"
            )}
            size={32}
            /** Bind directly to client.class */
            icon={bind(client, "class").as((cls) => {
              const theme = Gtk.IconTheme.get_default();
              // sanitize and lowercase
              const name = (cls ?? "unknown").toLowerCase();
              // fallback if the theme doesn’t have it
              return theme.has_icon(name)
                ? name
                : "application-x-executable";
            })}
          />
        ) : (
          <label label="No Window" />
        )
      )}
    </box>
  );
}

function Time({ format = "%H:%M - %a %e" }) {
  const time = Variable<string>("").poll(
    1000,
    () => GLib.DateTime.new_now_local().format(format)!
  );

  return (
    <label
      className="Time"
      onDestroy={() => time.drop()}
      label={time()}
    />
  );
}

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      className="Bar"
      gdkmonitor={monitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      layer="bottom"
    >
      <box className="wrapper">
        <centerbox>
          <box hexpand halign={Gtk.Align.START}>
            <Workspaces />
            <FocusedClient />
          </box>
          <box className="mediaPos">
            <Media />
          </box>
          <box hexpand halign={Gtk.Align.END}>
            <box className="tray-wifi">
              <SysTray />
              <Wifi />
              <IdleToggle />
            </box>
            <AudioSlider />
            <box className="batTime">
              <BatteryLevel />
              <Time />
            </box>
          </box>
        </centerbox>
      </box>
    </window>
  );
}
