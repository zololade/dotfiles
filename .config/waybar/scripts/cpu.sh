#!/bin/bash

# Get CPU usage percentage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')

# Get CPU frequency in MHz, then convert to GHz
CPU_FREQ=$(grep "cpu MHz" /proc/cpuinfo | head -n1 | awk '{print $4}')
CPU_FREQ_GHZ=$(awk "BEGIN {printf \"%.2f\", $CPU_FREQ/1000}")

# Output with CPU icon (nerd font)
# echo -e "\uf4bc ${CPU_FREQ_GHZ}GHz (${CPU_USAGE}%)"
echo -e "${CPU_FREQ_GHZ}GHz (${CPU_USAGE}%)"