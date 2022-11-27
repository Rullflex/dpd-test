<template>
    <div class="pagination">
        <button type="button" class="pagination__button" @click="decreasePage">prev</button>

        <div class="pagination__counter">{{ page }}</div>

        <button type="button" class="pagination__button" @click="increasePage">next</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from 'vue-property-decorator';

@Component
export default class VPagination extends Vue {
    @VModel({ type: Number, required: true })
    private page!: number;

    @Prop({ type: Number, required: true })
    private max!: number;

    @Prop({ type: Number, default: 1 })
    private min!: number;

    private decreasePage() {
        if (this.page > this.min) this.setPage(this.page - 1);
    }

    private increasePage() {
        if (this.page < this.max) this.setPage(this.page + 1);
    }

    private setPage(page: number) {
        this.page = page;
    }

    private normilazePage(page: number) {
        if (page > this.max) return this.max;
        if (page < this.min) return this.min;
        return page;
    }
}
</script>

<style lang="scss">
.pagination {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}
</style>
