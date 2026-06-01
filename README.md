# ding

Simple CLI tool to send Discord notifications.

## Features

- Send messages to Discord from terminal.
- Pipe command output directly to Discord.
- Run commands and get notified when they finish.
- Automatic duration tracking and host identification.

## Installation

Install globally using bun:

```bash
bun add -g @ravvdevv/ding
```

## Usage

### Send a message
```bash
ding -m "Task finished"
```

### Pipe input
```bash
echo "Backup complete" | ding
```

### Run a command
```bash
ding run "npm test"
```

The tool sends a notification when the command completes. It includes the exit status, duration, and host name.

## Configuration

On first run, the tool asks for a Discord Webhook URL.

- **Global Config**: `~/.ding/config.json`
- **Local Override**: `.ding/config.json` in current directory
