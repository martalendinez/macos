// src/components/windows/terminal/terminalCommands.js
// zsh-like command set for the portfolio Terminal.
// Output lines: a string, or { segs: [{ t: text, c: colorName, b: bold }] }.
import { GAME_LIST, HOME, getNode, prettyPath, resolvePath } from "./fs";
import { getApps } from "../../../config/apps";
import { PROFILE } from "../About/aboutData";

export const PROFILES = ["pro", "basic", "homebrew", "ocean"];

const seg = (t, c, b) => ({ t, c, b });
const line = (...segs) => ({ segs: segs.map((s) => (typeof s === "string" ? seg(s) : s)) });
const color = (t, c, b) => line(seg(t, c, b));

const NEOFETCH_LOGO = [
  ["                    'c.", "green"],
  ["                 ,xNMM.", "green"],
  ["               .OMMMMo", "green"],
  ["               OMMM0,", "green"],
  ["     .;loddo:' loolloddol;.", "green"],
  ["   cKMMMMMMMMMMNWMMMMMMMMMM0:", "yellow"],
  [" .KMMMMMMMMMMMMMMMMMMMMMMMWd.", "yellow"],
  [" XMMMMMMMMMMMMMMMMMMMMMMMX.", "orange"],
  [";MMMMMMMMMMMMMMMMMMMMMMMM:", "orange"],
  [":MMMMMMMMMMMMMMMMMMMMMMMM:", "red"],
  [".MMMMMMMMMMMMMMMMMMMMMMMMX.", "red"],
  [" kMMMMMMMMMMMMMMMMMMMMMMMMWd.", "magenta"],
  [" .XMMMMMMMMMMMMMMMMMMMMMMMMMMk", "magenta"],
  ["  .XMMMMMMMMMMMMMMMMMMMMMMMMK.", "blue"],
  ["    kMMMMMMMMMMMMMMMMMMMMMMd", "blue"],
  ["     ;KMMMMMMMWXXWMMMMMMMk.", "blue"],
  ["       .cooc,.    .,coo:.", "blue"],
];

const START = Date.now();

function fmtUptime() {
  const s = Math.floor((Date.now() - START) / 1000);
  const m = Math.floor(s / 60);
  return m ? `${m} min${m > 1 ? "s" : ""}, ${s % 60} secs` : `${s} secs`;
}

export const COMMANDS = {
  help: "Show this help",
  ls: "List files (ls -a, ls projects)",
  cd: "Change directory",
  pwd: "Print working directory",
  cat: "Print a file (cat about.txt)",
  open: "Open a file or app (open resume.pdf, open music)",
  tree: "Show the folder tree",
  neofetch: "System info, the cool way",
  whoami: "Who is Marta?",
  games: "List arcade games",
  play: "Play a game (play tetris)",
  theme: "Change profile: pro | basic | homebrew | ocean",
  history: "Show command history",
  echo: "Print text",
  date: "Show date & time",
  cowsay: "A cow says your message",
  matrix: "Enter the Matrix",
  hacker: "Enter hacker mode (opens secret projects)",
  clear: "Clear the screen (or Ctrl+L)",
  exit: "Close the session",
};

const MAN = {
  ls: "ls [-a] [path] — list directory contents. Try `ls projects` or `ls -a`.",
  cd: "cd [path] — change directory. `cd ..` goes up, `cd` or `cd ~` goes home.",
  cat: "cat <file> — print a file. Try `cat about.txt` or `cat places/stockholm.txt`.",
  open: "open <file|app> — open with the default app. `open resume.pdf`, `open -a Maps`, `open projects/sallskap.md`.",
  play: `play <game> — start a game: ${GAME_LIST.join(", ")}. Esc quits.`,
  theme: "theme <pro|basic|homebrew|ocean> — switch the Terminal profile.",
};

function appIndex() {
  const apps = getApps("glass").filter((a) => a.windowId);
  const map = {};
  apps.forEach((a) => {
    map[a.id.toLowerCase()] = a.windowId;
    map[a.label.toLowerCase()] = a.windowId;
    map[a.label.toLowerCase().replace(/\s+/g, "")] = a.windowId;
  });
  return map;
}

function listDir(node, showAll) {
  const names = Object.keys(node.children).filter((n) => showAll || !n.startsWith("."));
  if (showAll) names.unshift(".", "..");
  return line(
    ...names.flatMap((n, i) => {
      const child = node.children[n];
      const c = n === "." || n === ".." || child?.type === "dir" ? "blue" : child?.exec ? "green" : n.endsWith(".pdf") ? "red" : undefined;
      const label = child?.type === "dir" ? `${n}/` : child?.exec ? `${n}*` : n;
      return [seg(label, c, child?.type === "dir"), seg(i < names.length - 1 ? "    " : "")];
    })
  );
}

function treeLines(node, prefix = "") {
  const out = [];
  const names = Object.keys(node.children);
  names.forEach((n, i) => {
    const last = i === names.length - 1;
    const child = node.children[n];
    out.push(line(prefix + (last ? "└── " : "├── "), seg(child.type === "dir" ? `${n}/` : n, child.type === "dir" ? "blue" : child.exec ? "green" : undefined, child.type === "dir")));
    if (child.type === "dir") out.push(...treeLines(child, prefix + (last ? "    " : "│   ")));
  });
  return out;
}

/** Tab completion: command names, then paths. Returns { value, options }. */
export function complete(input, ctx) {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const opts = Object.keys(COMMANDS).filter((c) => c.startsWith(parts[0]));
    return opts.length === 1 ? { value: opts[0] + " " } : { options: opts };
  }
  const partial = parts[parts.length - 1];
  const dirPart = partial.includes("/") ? partial.slice(0, partial.lastIndexOf("/") + 1) : "";
  const base = partial.slice(dirPart.length);
  const node = getNode(ctx.fs, resolvePath(ctx.cwd, dirPart || "."));
  if (node?.type !== "dir") return { options: [] };
  let opts = Object.keys(node.children).filter((n) => n.startsWith(base) && (base.startsWith(".") || !n.startsWith(".")));
  if (parts[0] === "play") opts = GAME_LIST.filter((g) => g.startsWith(base));
  if (opts.length === 1) {
    const child = node.children[opts[0]];
    parts[parts.length - 1] = dirPart + opts[0] + (child?.type === "dir" ? "/" : " ");
    return { value: parts.join(" ") };
  }
  return { options: opts };
}

export function runCommand(raw, ctx) {
  const { print, fs, cwd, setCwd } = ctx;
  const [name0, ...args] = raw.trim().split(/\s+/);
  const name = name0.toLowerCase();

  // ./game or games/snake
  const execMatch = raw.trim().match(/^(?:\.\/|games\/|~\/games\/)?([\w-]+)$/);
  if (raw.trim().startsWith("./") || raw.trim().includes("games/")) {
    const target = getNode(fs, resolvePath(cwd, raw.trim()));
    if (target?.exec) return ctx.startGame(target.exec);
    return print(color(`zsh: no such file or directory: ${raw.trim()}`, "red"));
  }
  if (GAME_LIST.includes(name) && execMatch) return ctx.startGame(name);

  switch (name) {
    case "help":
      return print(
        color("MartaOS zsh — available commands", undefined, true),
        "",
        ...Object.entries(COMMANDS).map(([c, d]) => line(seg(c.padEnd(10), "green"), seg(d, "dim"))),
        "",
        color("Tip: Tab completes · ↑/↓ history · Ctrl+L clears · Ctrl+C cancels · man <cmd> for details", "dim"),
        ""
      );

    case "man":
      return print(MAN[args[0]] ? MAN[args[0]] : COMMANDS[args[0]] ? `${args[0]} — ${COMMANDS[args[0]]}` : color(`No manual entry for ${args[0] ?? ""}`, "red"));

    case "ls": {
      const showAll = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const target = args.find((a) => !a.startsWith("-")) ?? ".";
      const node = getNode(fs, resolvePath(cwd, target));
      if (!node) return print(color(`ls: ${target}: No such file or directory`, "red"));
      if (node.type === "file") return print(target);
      return print(listDir(node, showAll));
    }

    case "cd": {
      const path = resolvePath(cwd, args[0] ?? "~");
      const node = getNode(fs, path);
      if (!node) return print(color(`cd: no such file or directory: ${args[0]}`, "red"));
      if (node.type !== "dir") return print(color(`cd: not a directory: ${args[0]}`, "red"));
      return setCwd(path);
    }

    case "pwd":
      return print(cwd);

    case "tree":
      return print(color(prettyPath(cwd), "blue", true), ...treeLines(getNode(fs, cwd)));

    case "cat": {
      if (!args[0]) return print(color("usage: cat <file>", "yellow"));
      const node = getNode(fs, resolvePath(cwd, args[0]));
      if (!node) return print(color(`cat: ${args[0]}: No such file or directory`, "red"));
      if (node.type === "dir") return print(color(`cat: ${args[0]}: Is a directory`, "red"));
      return print(...node.lines.map((l) => (l.startsWith("#") ? color(l.replace(/^#+\s*/, ""), "cyan", true) : l)), "");
    }

    case "open": {
      const apps = appIndex();
      const target = (args[0] === "-a" ? args.slice(1) : args).join(" ");
      if (!target) return print(color("usage: open <file> | open -a <App>", "yellow"));
      const node = getNode(fs, resolvePath(cwd, target));
      if (node?.exec) return ctx.startGame(node.exec);
      if (node?.open?.window) {
        ctx.openWindow(node.open.window);
        return print(color(`Opening ${target}…`, "dim"));
      }
      if (node?.open?.url) {
        window.open(node.open.url, "_blank", "noopener,noreferrer");
        return print(color(`Opening ${target}…`, "dim"));
      }
      if (node?.type === "dir") return print(color(`${target} is a folder — try \`ls ${target}\``, "dim"));
      const app = apps[target.toLowerCase()] ?? apps[target.toLowerCase().replace(/\s+/g, "")];
      if (app) {
        ctx.openWindow(app);
        return print(color(`Opening ${target}…`, "dim"));
      }
      if (/^https?:\/\//.test(target)) {
        window.open(target, "_blank", "noopener,noreferrer");
        return print(color(`Opening ${target}…`, "dim"));
      }
      return print(color(`The file ${target} does not exist.`, "red"));
    }

    case "whoami":
      return print(
        line(seg("marta", "green", true)),
        `${PROFILE.role} @ ${PROFILE.company.name} · ${PROFILE.secondaryRole} · ${PROFILE.location}`,
        color("→ cat about.txt for more, or open about", "dim")
      );

    case "neofetch": {
      const apps = getApps("glass").filter((a) => a.kind === "app").length;
      const info = [
        [seg("marta", "green", true), seg("@"), seg("portfolio", "green", true)],
        [seg("-----------------")],
        ["OS", "MartaOS 2.0 (macOS-inspired)"],
        ["Host", "Your browser"],
        ["Kernel", "React 18.3 + Vite 5.4"],
        ["Uptime", fmtUptime()],
        ["Packages", `${apps} apps`],
        ["Shell", "zsh 5.9"],
        ["Resolution", `${window.innerWidth}x${window.innerHeight}`],
        ["Theme", ctx.appearance === "dark" ? "Dark" : "Light"],
        ["Terminal", `Terminal.app (${ctx.profile})`],
        ["Role", `${PROFILE.role} @ ${PROFILE.company.name}`],
        ["Location", PROFILE.location],
        ["Education", `MSc Interactive Media Tech · ${PROFILE.education.school}`],
        [],
        ["__colors"],
      ];
      const rows = Math.max(NEOFETCH_LOGO.length, info.length);
      const out = [];
      for (let i = 0; i < rows; i++) {
        const [art, c] = NEOFETCH_LOGO[i] ?? ["", undefined];
        const left = seg(art.padEnd(32), c, true);
        const r = info[i] ?? [];
        if (r[0] === "__colors") {
          out.push({ segs: [left, ...["red", "orange", "yellow", "green", "cyan", "blue", "magenta", "white"].map((cc) => seg("███", cc))] });
        } else if (r.length === 2 && typeof r[0] === "string") {
          out.push({ segs: [left, seg(`${r[0]}: `, "yellow", true), seg(r[1])] });
        } else out.push({ segs: [left, ...r] });
      }
      return print(...out, "");
    }

    case "games":
      return print(
        color("🕹  Arcade", undefined, true),
        ...GAME_LIST.map((g) => line(seg(`  ${g.padEnd(10)}`, "green"), seg(`play ${g}`, "dim"))),
        color("Your best scores are saved in this browser.", "dim"),
        ""
      );

    case "play":
      if (GAME_LIST.includes(args[0])) return ctx.startGame(args[0]);
      return print(color(`usage: play ${GAME_LIST.join(" | ")}`, "yellow"));

    case "theme":
      if (PROFILES.includes(args[0])) {
        ctx.setProfile(args[0]);
        return print(color(`Profile set to ${args[0]}.`, "dim"));
      }
      return print(`current: ${ctx.profile}`, color(`usage: theme ${PROFILES.join(" | ")}`, "yellow"));

    case "history":
      return print(...ctx.history.map((h, i) => line(seg(String(i + 1).padStart(4) + "  ", "dim"), seg(h))));

    case "echo":
      return print(raw.trim().slice(5));

    case "date":
      return print(new Date().toString().replace(/\(.+\)/, "").trim());

    case "uname":
      return print(args.includes("-a") ? "MartaOS portfolio 2.0 React-18.3 x86_64-browser" : "MartaOS");

    case "cowsay": {
      const msg = args.join(" ") || "moo";
      return print(
        " " + "_".repeat(msg.length + 2),
        `< ${msg} >`,
        " " + "-".repeat(msg.length + 2),
        "        \\   ^__^",
        "         \\  (oo)\\_______",
        "            (__)\\       )\\/\\",
        "                ||----w |",
        "                ||     ||",
        ""
      );
    }

    case "sudo":
      return print(color("Password:", "dim"), color("marta is not in the sudoers file. This incident will be reported. 🚨", "red"));

    case "rm":
      if (raw.includes("-rf")) return print(color("rm: nice try 😏 this portfolio took too long to build.", "yellow"));
      return print(color("rm: permission denied", "red"));

    case "matrix":
      return ctx.startGame("matrix");

    case "hacker":
      print(
        color(">>> initiating hacker mode…", "green", true),
        color("decrypting portfolio vault · · ·", "dim"),
        color("auth ok ✓  channels secure ✓  access granted ✓", "green"),
        ""
      );
      return ctx.openWindow("secretProjects");

    // shortcuts kept from the original Terminal
    case "skills":
      return runCommand("cat ~/skills.md", ctx);
    case "projects":
      runCommand("ls ~/projects", ctx);
      ctx.openWindow("projects");
      return print(color("(opening Projects… or `cat projects/<name>.md` right here)", "dim"));
    case "map":
    case "maps":
    case "music":
      ctx.openWindow(name === "music" ? "music" : "map");
      return print(color(`Opening ${name}…`, "dim"));

    case "resume":
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      return print(color("Opening resume.pdf…", "dim"));

    case "clear":
      return ctx.clear();

    case "exit":
    case "logout":
      return ctx.exit();

    default: {
      const suggestion = Object.keys(COMMANDS).find((c) => c.startsWith(name.slice(0, 2)));
      return print(
        color(`zsh: command not found: ${name0}`, "red"),
        ...(suggestion ? [color(`did you mean: ${suggestion}? (type help for everything)`, "dim")] : [])
      );
    }
  }
}

export { HOME };
