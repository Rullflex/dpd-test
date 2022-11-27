<template>
    <input ref="input" :value="inputValue" class="v-input" inputmode="numeric" v-on="listeners" />
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';

@Component
export default class VInputNumeric extends Vue {
    @Prop({ type: [Number, Object], default: null })
    private value!: number | null;

    @Ref() private input!: HTMLInputElement;

    private inputValue = '';

    private get listeners() {
        return {
            ...this.$listeners,
            input: this.inputHandler,
            change: this.changeHandler,
        };
    }

    @Watch('value')
    private valueWatchHandler() {
        this.inputValue = this.value?.toLocaleString('fullwide', { useGrouping: false }) ?? '';
    }

    @Emit('input')
    private inputHandler(event: InputEvent): number | null {
        const { value } = event.target as HTMLInputElement;
        this.input.value = value.replace(/\D/g, '');
        return this.parseNumber(value);
    }

    @Emit('change')
    private changeHandler(event: InputEvent): number | null {
        const { value } = event.target as HTMLInputElement;
        return this.parseNumber(value);
    }

    private parseNumber(value: string): number | null {
        const digits = value.replace(/\D/g, '');
        const numberValue = parseInt(digits, 10);
        return isNaN(numberValue) ? null : numberValue;
    }

    private created() {
        this.valueWatchHandler();
    }
}
</script>
