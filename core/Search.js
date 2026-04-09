/**
 * Search.js - Asset Classifier & Dispatcher
 * 役割: 解凍されたファイルのパスを解析し、種類（ブロック、画像、音、エンティティ）を特定して分類する
 */

export class ModScanner {
    constructor() {
        this.namespace = "default_mod";
        // 分類済みのファイルリスト
        this.registry = {
            blockStates: [], // Java版特有のブロック状態定義
            models: {
                block: [],
                item: [],
                entity: []
            },
            textures: [],
            sounds: [],
            lang: [],
            scripts: [], // .classファイルなど（後の解析用）
            unknown: []
        };
    }

    /**
     * file.js から渡されたファイルリストをスキャンする
     * @param {Object} fileMap - { "path/to/file": Uint8Array }
     */
    async scan(fileMap) {
        console.log("Starting asset classification...");
        const paths = Object.keys(fileMap);

        // 1. ネームスペース (MOD ID) の特定
        // assets/ の直後にあるフォルダ名を探す（例: assets/my_mod/textures/...）
        this.detectNamespace(paths);

        // 2. 全ファイルをループして分類
        for (const path of paths) {
            const ext = path.split('.').pop().toLowerCase();
            
            // フォルダパスと拡張子に基づいて仕分け
            if (path.includes('/blockstates/')) {
                this.registry.blockStates.push(path);
            } 
            else if (path.includes('/models/block/')) {
                this.registry.models.block.push(path);
            }
            else if (path.includes('/models/item/')) {
                this.registry.models.item.push(path);
            }
            else if (path.includes('/models/entity/')) {
                this.registry.models.entity.push(path);
            }
            else if (path.includes('/textures/')) {
                if (['png', 'tga', 'jpg'].includes(ext)) {
                    this.registry.textures.push(path);
                }
            }
            else if (path.includes('/sounds/') || path.endsWith('sounds.json')) {
                this.registry.sounds.push(path);
            }
            else if (path.endsWith('.lang') || (path.includes('/lang/') && ext === 'json')) {
                this.registry.lang.push(path);
            }
            else if (ext === 'class' || ext === 'java') {
                this.registry.scripts.push(path);
            }
            else {
                this.registry.unknown.push(path);
            }
        }

        return {
            namespace: this.namespace,
            registry: this.registry
        };
    }

    /**
     * assets フォルダ直下のフォルダ名から Namespace を特定
     */
    detectNamespace(paths) {
        const assetEntry = paths.find(p => p.startsWith('assets/') && p.split('/').length > 2);
        if (assetEntry) {
            this.namespace = assetEntry.split('/')[1];
            console.log(`Detected Namespace: ${this.namespace}`);
        } else {
            console.warn("Could not detect namespace. Using 'default_mod'.");
        }
    }

    /**
     * 統計情報をターミナルに表示するためのヘルパー
     */
    getStats() {
        return {
            total: Object.values(this.registry).flat(2).length,
            textures: this.registry.textures.length,
            blocks: this.registry.blockStates.length,
            entities: this.registry.models.entity.length,
            sounds: this.registry.sounds.length
        };
    }
}
