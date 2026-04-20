<script setup lang="ts">
import { ref, computed } from "vue";
import { useInventoryStore } from "./stores/inventory";
import {
    Package,
    Search,
    Plus,
    Trash2,
    AlertTriangle,
    BoxSelect,
    Minus,
    CheckCircle2,
    Edit3,
    X,
    Filter,
} from "lucide-vue-next";

const store = useInventoryStore();
const showModal = ref(false);

// 編集モード管理
const editingId = ref<string | null>(null);

// 統計データ
const stats = computed(() => {
    const total = store.products.length;
    const lowStock = store.products.filter((p) => p.quantity > 0 && p.quantity < 5).length;
    const outOfStock = store.products.filter((p) => p.quantity === 0).length;
    return { total, lowStock, outOfStock };
});

const form = ref({ sku: "", name: "", quantity: 1 });

// モーダルを開く（新規・編集共通）
const openModal = (item?: any) => {
    if (item) {
        editingId.value = item.id;
        form.value = { sku: item.sku, name: item.name, quantity: item.quantity };
    } else {
        editingId.value = null;
        form.value = { sku: "", name: "", quantity: 1 };
    }
    showModal.value = true;
};

// 登録・更新処理
const submit = () => {
    const trimmedSku = form.value.sku.trim();
    const trimmedName = form.value.name.trim();

    if (!trimmedName || !trimmedSku) {
        return alert("商品名とSKUは必須です");
    }

    const isDuplicate = store.products.some((p) => {
        if (editingId.value && p.id === editingId.value) return false;
        return p.sku === trimmedSku;
    });

    if (isDuplicate) {
        return alert(`SKU「${trimmedSku}」はすでに登録されています。`);
    }

    const finalData = { ...form.value, sku: trimmedSku, name: trimmedName };

    if (editingId.value) {
        store.updateProduct(editingId.value, finalData);
    } else {
        store.addProduct(finalData);
    }

    showModal.value = false;
};
</script>

<template>
    <div
        class="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-green-100 selection:text-green-900"
    >
        <header class="bg-white border-b border-gray-100 sticky top-0 z-30">
            <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="bg-green-100 p-1.5 rounded-lg">
                        <Package class="text-green-500" :size="24" />
                    </div>
                    <h1 class="text-xl font-bold text-gray-900 tracking-tight">StockManager</h1>
                </div>
                <button
                    @click="openModal()"
                    class="inline-flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-full shadow-sm shadow-green-500/20 transition-all"
                >
                    <Plus :size="18" /> 新規アイテム
                </button>
            </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 py-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div class="p-4 bg-green-50 rounded-xl text-green-500"><BoxSelect :size="26" /></div>
                    <div>
                        <p class="text-xs font-bold text-gray-400 mb-1">登録アイテム数</p>
                        <p class="text-3xl font-black text-gray-800 tabular-nums">{{ stats.total }}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div class="p-4 bg-amber-50 rounded-xl text-amber-500"><AlertTriangle :size="26" /></div>
                    <div>
                        <p class="text-xs font-bold text-gray-400 mb-1">在庫わずか</p>
                        <p class="text-3xl font-black text-gray-800 tabular-nums">{{ stats.lowStock }}</p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                    <div class="p-4 bg-red-50 rounded-xl text-red-500"><AlertTriangle :size="26" /></div>
                    <div>
                        <p class="text-xs font-bold text-gray-400 mb-1">在庫切れ</p>
                        <p class="text-3xl font-black text-red-500 tabular-nums">{{ stats.outOfStock }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="p-5 border-b border-gray-50 bg-gray-50/20">
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="relative w-full max-w-sm">
                            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
                            <input
                                v-model="store.searchQuery"
                                type="text"
                                placeholder="SKU または 商品名で検索..."
                                class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all"
                            />
                        </div>

                        <div class="flex items-center gap-2 w-full sm:w-auto">
                            <div class="bg-white p-2.5 rounded-xl border border-gray-200 hidden sm:block">
                                <Filter class="text-gray-400" :size="18" />
                            </div>
                            <select
                                v-model="store.statusFilter"
                                class="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-green-500/50 outline-none block w-full sm:w-48 py-2.5 px-3 cursor-pointer hover:bg-gray-50 transition-all font-bold"
                            >
                                <option value="all">すべてのステータス</option>
                                <option value="in-stock">在庫あり</option>
                                <option value="low-stock">在庫わずか</option>
                                <option value="out-of-stock">在庫切れ</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr
                                class="bg-gray-50/30 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100"
                            >
                                <th class="px-6 py-4">商品情報</th>
                                <th class="px-6 py-4 text-center">ステータス</th>
                                <th class="px-6 py-4 text-center">在庫数</th>
                                <th class="px-6 py-4 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr
                                v-for="item in store.filteredProducts"
                                :key="item.id"
                                class="hover:bg-green-50/20 transition-colors group"
                            >
                                <td class="px-6 py-5">
                                    <div class="text-sm font-bold text-gray-800">{{ item.name }}</div>
                                    <div
                                        class="text-[11px] text-gray-400 mt-1 font-mono bg-gray-100 px-1.5 py-0.5 rounded inline-block"
                                    >
                                        {{ item.sku }}
                                    </div>
                                </td>
                                <td class="px-6 py-5 text-center">
                                    <span
                                        v-if="item.quantity === 0"
                                        class="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600"
                                        >在庫切れ</span
                                    >
                                    <span
                                        v-else-if="item.quantity < 5"
                                        class="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600"
                                        >在庫わずか</span
                                    >
                                    <span
                                        v-else
                                        class="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600"
                                        >在庫あり</span
                                    >
                                </td>
                                <td class="px-6 py-5">
                                    <div class="flex items-center justify-center gap-3">
                                        <button
                                            @click="
                                                store.updateProduct(item.id, {
                                                    quantity: Math.max(0, item.quantity - 1),
                                                })
                                            "
                                            class="w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all"
                                        >
                                            -
                                        </button>
                                        <span class="text-lg font-black w-8 text-center tabular-nums">{{
                                            item.quantity
                                        }}</span>
                                        <button
                                            @click="store.updateProduct(item.id, { quantity: item.quantity + 1 })"
                                            class="w-8 h-8 rounded-full border border-gray-200 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-5 text-right">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            @click="openModal(item)"
                                            class="text-gray-300 hover:text-green-500 p-2 rounded-lg transition-colors"
                                        >
                                            <Edit3 :size="18" />
                                        </button>
                                        <button
                                            @click="store.deleteProduct(item.id)"
                                            class="text-gray-300 hover:text-red-500 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 :size="18" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="store.filteredProducts.length === 0">
                                <td colspan="4" class="px-6 py-20 text-center">
                                    <div
                                        class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4"
                                    >
                                        <Package class="text-gray-300" :size="32" />
                                    </div>
                                    <h3 class="text-sm font-bold text-gray-800 mb-1">アイテムがありません</h3>
                                    <p class="text-sm text-gray-400">新しいアイテムを登録して管理を始めましょう。</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" @click="showModal = false"></div>
            <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 overflow-hidden">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold text-gray-900">
                        {{ editingId ? "アイテムを編集" : "新規アイテムの追加" }}
                    </h2>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                        <X :size="20" />
                    </button>
                </div>

                <div class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide"
                            >SKU / 管理番号</label
                        >
                        <input
                            v-model="form.sku"
                            type="text"
                            class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">商品名</label>
                        <input
                            v-model="form.name"
                            type="text"
                            class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">数量</label>
                        <input
                            v-model.number="form.quantity"
                            type="number"
                            min="0"
                            class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>

                <div class="mt-8 flex gap-3">
                    <button
                        @click="showModal = false"
                        class="flex-1 py-3 border border-gray-100 rounded-xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button
                        @click="submit"
                        class="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 transition-all"
                    >
                        {{ editingId ? "更新する" : "追加する" }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
