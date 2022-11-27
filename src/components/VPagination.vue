<template>
    <div class="pagination">
        <button type="button" @click="decreasePage">prev</button>

        <VInputNumeric :value="inputValue" @input="inputHandler" @change="changeHandler"></VInputNumeric>

        <button type="button" @click="increasePage">next</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue, Watch } from 'vue-property-decorator';

// Utils
import { isNull } from 'lodash';

// Components
import VInputNumeric from '@/components/VInputNumeric.vue';

@Component({
    components: {
        VInputNumeric,
    },
})
export default class VPagination extends Vue {
    @VModel({ type: Number, required: true })
    private page!: number;

    @Prop({ type: Number, required: true })
    private max!: number;

    @Prop({ type: Number, default: 1 })
    private min!: number;

    private inputValue: number | null = null;

    @Watch('page')
    private onPageChanged() {
        this.inputValue = this.page;
    }

    @Watch('max')
    @Watch('min')
    private onMinMaxChanged() {
        this.page = this.getInRange(this.page);
    }

    private isOutOfRange(page: number) {
        return page > this.max || page < this.min;
    }

    private getInRange(page: number) {
        if (page < this.min) return this.min;
        if (page > this.max) return this.max;
        return page;
    }

    private decreasePage() {
        if (this.page > this.min) this.page = this.page - 1;
    }

    private increasePage() {
        if (this.page < this.max) this.page = this.page + 1;
    }

    private inputHandler(value: number | null) {
        this.inputValue = value;
        if (!isNull(value)) this.page = this.getInRange(value);
    }

    private changeHandler(value: number | null) {
        this.inputValue = this.page;
    }

    private created() {
        this.onPageChanged();
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
