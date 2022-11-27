<template>
    <div id="app">
        <VPagination v-model="currentPage" :max="20"></VPagination>

        <table>
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th>Full name</th>
                    <th>Gender</th>
                    <th>Country</th>
                    <th>Birth date</th>
                    <th>Email</th>
                    <th>Phone number</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, rowIdx) in tableData" :key="rowIdx">
                    <td><img :src="row.picture.medium" alt="" /></td>
                    <td>{{ row.name.first }} {{ row.name.last }}</td>
                    <td>{{ row.gender }}</td>
                    <td>{{ row.location.country }}</td>
                    <td>{{ row.dob.date }}</td>
                    <td>{{ row.email }}</td>
                    <td>{{ row.phone }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Components
import VPagination from '@/components/VPagination.vue';

// Interfaces
import User from '@/core/interfaces/User';

@Component({
    components: {
        VPagination,
    },
})
export default class App extends Vue {
    tableData: User[] = [];
    currentPage = 1;

    async created() {
        const res: { results: User[] } = await (await fetch('/api.json')).json();
        this.tableData = res.results;
    }
}
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
