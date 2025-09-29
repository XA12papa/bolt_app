const BASE_WORKER_DIR = "./temp/bolty-worker";

if (!Bun.file(BASE_WORKER_DIR).exists()){
    await Bun.write(BASE_WORKER_DIR, "");
}

export async function onFileUpdate(filePath : string, fileContent : string){
    console.log(`Write file  : ${filePath }`)
    await Bun.write(`${BASE_WORKER_DIR}/${filePath}`, fileContent);
}

export function onShellCommand(shellCommand: string) {
    console.log("Running shell command:", shellCommand);
    const commands = shellCommand.split("&&");

    for (const command of commands) {
        const trimmedCommand = command.trim();
        console.log(`Executing: ${trimmedCommand}`);
        
        // Use shell to properly handle complex commands
        const result = Bun.spawnSync({
            cmd: ["sh", "-c", trimmedCommand],
            cwd: BASE_WORKER_DIR
        });
        
        const stdout = new TextDecoder().decode(result.stdout);
        const stderr = new TextDecoder().decode(result.stderr);

        if (stdout) {
            console.log("STDOUT:", stdout);
        }
        if (stderr) {
            console.error("STDERR:", stderr);
        }
        
        console.log(`Exit code: ${result.exitCode}`);
        
        // Stop execution if command failed
        if (result.exitCode !== 0) {
            console.error(`Command failed with exit code: ${result.exitCode}`);
            break;
        }
    }
}