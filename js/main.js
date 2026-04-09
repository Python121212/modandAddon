/**
 * main.js - 全体の司令塔
 * 役割: UIイベントの監視、各変換モジュールの実行順序制御、進捗管理
 */

// 各モジュールのインポート（これらは順次作成していきます）
// import { ModScanner } from './core/Search.js';
// import { FileHandler } from './core/file.js';
// import { ErrorCommander } from './monitor/Error.js';
// import { ManifestGenerator } from './core/Manifest.js';

class AppController {
    constructor() {
        // 状態管理
        this.selectedFile = null;
        this.isConverting = false;
        
        // UI要素のバインド
        this.initUIElements();
        this.attachEventListeners();
        
        this.addLog("System initialized. Ready for conversion.", "success");
    }

    initUIElements() {
        this.convertBtn = document.getElementById('convert-btn');
        this.consoleLog = document.getElementById('console-log');
        this.progressBar = document.getElementById('progress-bar');
        this.progressText = document.getElementById('progress-text');
        this.namespaceDisplay = document.getElementById('detected-namespace');
    }

    attachEventListeners() {
        // 変換開始ボタン
        this.convertBtn.addEventListener('click', () => this.startConversion());
    }

    /**
     * ログ出力の統合管理
     * @param {string} message - メッセージ内容
     * @param {string} type - 'info', 'success', 'error'
     */
    addLog(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        
        const prefix = document.createElement('span');
        prefix.className = 'prefix';
        prefix.textContent = '>';
        
        entry.appendChild(prefix);
        entry.appendChild(document.createTextNode(message));
        
        this.consoleLog.prepend(entry);
        console.log(`[${type.toUpperCase()}] ${message}`);
    }

    /**
     * 進捗バーの更新
     * @param {number} percent - 0 to 100
     */
    updateProgress(percent) {
        const p = Math.min(100, Math.max(0, percent));
        this.progressBar.style.width = `${p}%`;
        this.progressText.textContent = `${Math.floor(p)}%`;
    }

    /**
     * メイン変換シーケンス
     * このメソッドが「世界初」の変換プロセスを順番に実行する
     */
    async startConversion() {
        if (this.isConverting || !targetFile) return;

        this.isConverting = true;
        this.convertBtn.disabled = true;
        this.addLog("Initiating conversion sequence...", "info");

        try {
            // 1. ファイルの読み込み (file.js 担当予定)
            this.updateProgress(10);
            this.addLog("Unzipping .jar file...");
            // const jarData = await FileHandler.unzip(targetFile);

            // 2. ファイルスキャン & 仕分け (Search.js 担当予定)
            this.updateProgress(30);
            this.addLog("Scanning assets and identifying namespace...");
            // const scanner = new ModScanner();
            // const assets = await scanner.scanJar(targetFile);
            // this.namespaceDisplay.textContent = scanner.namespace;

            // 3. 変換フェーズ (各専門コンバーター担当)
            this.addLog("Converting assets (Textures, Sounds, Models)...");
            // ここで Sound.js, テクスチャ.js, Entity.js などをループ実行
            // 進捗を 40% -> 80% まで徐々に上げる
            for(let i = 40; i <= 80; i += 10) {
                await new Promise(r => setTimeout(r, 500)); // ダミー待ち時間
                this.updateProgress(i);
            }

            // 4. マニフェスト生成 (Manifest.js 担当予定)
            this.addLog("Generating manifest.json and UUIDs...");
            this.updateProgress(90);

            // 5. パッケージング & ダウンロード (file.js 担当予定)
            this.addLog("Packaging into .mcpack...");
            // await FileHandler.download(convertedData);
            
            this.updateProgress(100);
            this.addLog("Conversion completed successfully!", "success");
            this.addLog("Download should start automatically.", "info");

        } catch (error) {
            // Error.js / subError.js との連携
            this.addLog(`Critical Error: ${error.message}`, "error");
            this.addLog("Conversion aborted.", "error");
        } finally {
            this.isConverting = false;
            this.convertBtn.disabled = false;
        }
    }
}

// アプリケーションの起動
window.addEventListener('DOMContentLoaded', () => {
    window.app = new AppController();
});
