/**
 * file.js - Data Logistics Center
 * 役割: ファイルの解凍(Unzip)、メモリ内保存、再圧縮(Zip)、ダウンロード処理
 */

// JSZipは外部ライブラリとしてCDN等で読み込まれている前提
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

export class FileHandler {
    constructor() {
        this.zip = new JSZip();
        this.extractedFiles = {}; // パス: データ の形式で保持
    }

    /**
     * Java MOD (.jar) を解凍してメモリに展開する
     * @param {File} file - ユーザーが選択したファイル 
     */
    async unzip(file) {
        try {
            const zipContent = await JSZip.loadAsync(file);
            this.extractedFiles = {}; // リセット

            // 全ファイルをループして、扱いやすいオブジェクト形式に変換
            const promises = [];
            zipContent.forEach((relativePath, fileEntry) => {
                if (!fileEntry.dir) {
                    const promise = fileEntry.async("uint8array").then(data => {
                        this.extractedFiles[relativePath] = data;
                    });
                    promises.push(promise);
                }
            });

            await Promise.all(promises);
            return this.extractedFiles; // 構造化された全ファイルデータ
        } catch (err) {
            throw new Error(`Unzip Failed: ${err.message}`);
        }
    }

    /**
     * 変換後のデータを .mcpack (Zip) に固めてダウンロードさせる
     * @param {Object} convertedData - { path: data } 形式のオブジェクト
     * @param {string} fileName - 出力ファイル名
     */
    async download(convertedData, fileName = "converted_mod.mcpack") {
        const outZip = new JSZip();

        // 変換されたファイルを新しいZip構造に詰め込む
        for (const [path, data] of Object.entries(convertedData)) {
            outZip.file(path, data);
        }

        // バイナリ（Blob）として生成
        const content = await outZip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 9 } // 最高圧縮
        });

        // ブラウザのダウンロード機能を発火
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // メモリ解放
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }

    /**
     * 特定のファイルパスからデータを取得（ユーティリティ）
     */
    getFile(path) {
        return this.extractedFiles[path] || null;
    }
}
