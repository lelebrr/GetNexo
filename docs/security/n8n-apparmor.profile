#include <tunables/global>

profile n8n flags=(attach_disconnected) {
  #include <abstractions/base>
  
  # Network access
  network inet tcp,
  network inet udp,
  network inet6 tcp,
  network inet6 udp,

  # Deny write access to critical system directories
  deny /etc/** w,
  deny /boot/** w,
  deny /sys/** w,
  deny /proc/** w,

  # Allow access to n8n data directory
  /home/node/.n8n/** rwk,
  
  # Deny dangerous capabilities
  deny capability sys_ptrace,
  deny capability sys_admin,
}
