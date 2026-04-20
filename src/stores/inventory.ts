import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export interface Product {
    id: string;
    sku: string;
    name: string;
    quantity: number;
}

export type FilterStatus = "all" | "in-stock" | "low-stock" | "out-of-stock";

export const useInventoryStore = defineStore("inventory", () => {
    // 初期データの復元
    const savedData = localStorage.getItem("inventory_app_data");
    const products = ref<Product[]>(savedData ? JSON.parse(savedData) : []);

    // 検索・フィルター状態
    const searchQuery = ref("");
    const statusFilter = ref<FilterStatus>("all");

    // 検索・フィルター・ソートを適用したリスト
    const filteredProducts = computed(() => {
        const q = searchQuery.value.toLowerCase();

        return (
            products.value
                .filter((p) => {
                    // 1. テキスト検索
                    const matchText = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);

                    // 2. ステータスフィルター
                    let matchStatus = true;
                    if (statusFilter.value === "in-stock") matchStatus = p.quantity >= 5;
                    else if (statusFilter.value === "low-stock") matchStatus = p.quantity > 0 && p.quantity < 5;
                    else if (statusFilter.value === "out-of-stock") matchStatus = p.quantity === 0;

                    return matchText && matchStatus;
                })
                // 常にSKU順で並び替えて固定
                .sort((a, b) => a.sku.localeCompare(b.sku))
        );
    });

    const addProduct = (item: Omit<Product, "id">) => {
        products.value.push({
            ...item,
            id: crypto.randomUUID(),
        });
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        const index = products.value.findIndex((p) => p.id === id);
        if (index !== -1) {
            products.value[index] = { ...products.value[index], ...updates };
        }
    };

    const deleteProduct = (id: string) => {
        products.value = products.value.filter((p) => p.id !== id);
    };

    // データの自動保存
    watch(
        products,
        (newVal) => {
            localStorage.setItem("inventory_app_data", JSON.stringify(newVal));
        },
        { deep: true },
    );

    return { products, searchQuery, statusFilter, filteredProducts, addProduct, updateProduct, deleteProduct };
});
