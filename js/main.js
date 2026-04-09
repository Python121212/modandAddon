/**
 * main.js - System Kernel
 * 役割: UI制御、ターミナルコマンド実行、各コンバーターモジュールのオーケストレーション
 */

class AppController {
    constructor() {
        // 1. 内部状態の初期化
        this.selectedFile = null;
        this.isConverting = false;
        this.namespace = "---";

        // 2. UI要素のキャプチャ
        this.elements = {
            dropZone: document.getElementById('drop-zone'),
            fileInput: document.getElementById('file-input'),
            convertBtn: document.getElementById('convert-btn'),
            consoleLog: document.getElementById('console-log'),
            terminalInput: document.getElementById('terminal-input'),
            progressBar: document.getElementById('progress-bar'),
            progressText: document.getElementById('ui-progress-text'),
            filenameDisplay: document.getElementById('ui-filename'),
            namespaceDisplay: document.getElementById('ui-namespace'),
            statusLight: document.getElementById('status-light'),
            offlineOverlay: document.getElementById('offline-overlay')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupEnvironmentCheck();
        this.addLog("Kernel initialized. System status: OPTIMAL", "success");
    }

    // --- 環境監視 (Offline/Online) ---
    setupEnvironmentCheck() {
        const updateStatus = () => {
            if (navigator.onLine) {
                this.elements.offlineOverlay.style.display = 'none';
                this.elements.statusLight.textContent = "READY";
                this.elements.statusLight.className = "status-light online";
            } else {
                this.elements.offlineOverlay.style.display = 'flex';
                this.elements.statusLight.textContent = "OFFLINE";
                this.elements.statusLight.className = "status-light offline";
                this.addLog("Network link severed. Emergency mode active.", "error");
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        if (!navigator.onLine) updateStatus();
    }

    // --- イベントリスナー設定 ---
    setupEventListeners() {
        // ファイル選択関連
        this.elements.dropZone.addEventListener('click', () => this.elements.fileInput.click());
        this.elements.fileInput.addEventListener('change', (e) => this.handleFile(e.target.files[0]));
        
        this.elements.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.add('drag-over');
        });
        this.elements.dropZone.addEventListener('dragleave', () => this.elements.dropZone.classList.remove('drag-over'));
        this.elements.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.elements.dropZone.classList.remove('drag-over');
            this.handleFile(e.dataTransfer.files[0]);
        });

        // ターミナル入力
        this.elements.terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.elements.terminalInput.value.trim();
                if (cmd) this.executeCommand(cmd);
                this.elements.terminalInput.value = '';
            }
        });

        // 実行ボタン
        this.elements.convertBtn.addEventListener('click', () => this.executeConversion());
    }

    // --- ファイルハンドリング ---
    handleFile(file) {
        if (!file || !file.name.endsWith('.jar')) {
            this.addLog("Invalid file type. Only .jar (Java MOD) is accepted.", "error");
            return;
        }
        this.selectedFile = file;
        this.elements.filenameDisplay.textContent = file.name;
        this.elements.convertBtn.disabled = false;
        this.addLog(`Source loaded: ${file.name}`, "success");
        this.addLog("Type 'convert' or click Execute to start.");
    }

    // --- ターミナルコマンド実行 ---
    executeCommand(input) {
        const cmd = input.toLowerCase();
        this.addLog(`admin@mc-conv:~$ ${input}`, "info");

        switch(cmd) {
            case 'help':
                this.addLog("Commands: help, status, clear, convert, version, reboot");
                break;
            case 'status':
                const netStatus = navigator.onLine ? "Online" : "Offline";
                this.addLog(`[SYSTEM] Net: ${netStatus} | File: ${this.selectedFile ? "Ready" : "None"}`);
                break;
            case 'clear':
                this.elements.consoleLog.innerHTML = '';
                break;
            case 'convert':
                this.executeConversion();
                break;
            case 'version':
                this.addLog("Engine: Java-to-Bedrock Alpha v0.1.0");
                break;
            case 'reboot':
                window.location.reload();
                break;
            default:
                this.addLog(`Unknown command: ${cmd}`, "error");
        }
    }

    // --- ログ出力 ---
    addLog(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `<span class="prefix">system:</span>${message}`;
        this.elements.consoleLog.appendChild(entry);
        this.elements.consoleLog.scrollTop = this.elements.consoleLog.scrollHeight;
    }

    // --- 進捗更新 ---
    updateProgress(percent) {
        this.elements.progressBar.style.width = `${percent}%`;
        this.elements.progressText.textContent = `${Math.floor(percent)}%`;
    }

    // --- メイン変換プロセス (各モジュールとの連携ポイント) ---
    async executeConversion() {
        if (this.isConverting || !this.selectedFile) return;

        this.isConverting = true;
        this.elements.convertBtn.disabled = true;
        this.updateProgress(0);
        
        this.addLog(">>> EXECUTION SEQUENCE STARTED", "info");

        try {
            // STEP 1: ファイル解凍 (file.js)
            this.addLog("Unzipping Java archive...");
            await this.simulateWork(15); // 実装待ちのダミー

            // STEP 2: 解析 (Search.js)
            this.addLog("Scanning for block and item definitions...");
            await this.simulateWork(40);
            this.namespace = "converted_mod"; // 仮
            this.elements.namespaceDisplay.textContent = this.namespace;

            // STEP 3: 翻訳 (codejava.js / codeBedrock.js)
            this.addLog("Translating Java logic to Bedrock Components...");
            await this.simulateWork(80);

            // STEP 4: パッケージング (file.js / Manifest.js)
            this.addLog("Generating .mcpack bundle...");
            await this.simulateWork(100);

            this.addLog("CONVERSION COMPLETE. Archive ready for deployment.", "success");

        } catch (err) {
            this.addLog(`FATAL ERROR: ${err.message}`, "error");
        } finally {
            this.isConverting = false;
            this.elements.convertBtn.disabled = false;
        }
    }

    // 実装までのテスト用遅延関数
    simulateWork(percent) {
        return new Promise(resolve => {
            setTimeout(() => {
                this.updateProgress(percent);
                resolve();
            }, 1000);
        });
    }
}

// 起動
document.addEventListener('DOMContentLoaded', () => {
    window.kernel = new AppController();
});
