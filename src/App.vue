<template>
    <div id="app">
        <VPagination v-model="currentPage" :max="paginationMax"></VPagination>

        <input v-model="searchText" type="text" />

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
                <tr v-for="(row, rowIdx) in currentPageTableData" :key="rowIdx">
                    <td><img :src="row.picture" alt="" /></td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.gender }}</td>
                    <td>{{ row.country }}</td>
                    <td>{{ row.date | formatDate }}</td>
                    <td>{{ row.email }}</td>
                    <td>{{ row.phone }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Utils
import { chunk, pick } from 'lodash';
import hasSearch from '@/core/utils/HasSearch';
import { DateTime } from 'luxon';

// Components
import VPagination from '@/components/VPagination.vue';

// Interfaces
import User from '@/core/interfaces/User';

interface TableRow {
    picture: string;
    name: string;
    gender: string;
    country: string;
    date: string;
    email: string;
    phone: string;
}

const PAGINATION_SIZE = 20;

@Component({
    components: {
        VPagination,
    },
    filters: {
        formatDate(date: string) {
            return DateTime.fromISO(date).toLocal().toFormat('yyyy LLL dd');
        },
    },
})
export default class App extends Vue {
    private tableData: User[] = [];
    private currentPage = 1;
    private searchText = '';

    private get transformedTableData(): TableRow[] {
        return this.tableData.map((user) => {
            return {
                picture: user.picture.medium,
                name: user.name.first + ' ' + user.name.last,
                gender: user.gender,
                country: user.location.country,
                date: user.dob.date,
                email: user.email,
                phone: user.phone,
            };
        });
    }

    private get filteredTableData(): TableRow[] {
        return this.transformedTableData.filter((row) => {
            const searchString = Object.values(pick(row, 'name', 'gender', 'country', 'date', 'email', 'phone')).join(
                '',
            );
            return hasSearch(searchString, this.searchText);
        });
    }

    private get chunkedTableData(): TableRow[][] {
        return chunk(this.filteredTableData, PAGINATION_SIZE);
    }

    private get currentPageTableData() {
        return this.chunkedTableData[this.currentPage - 1];
    }

    private get paginationMax() {
        return this.chunkedTableData.length;
    }

    private async created() {
        const { results: users }: { results: User[] } = await (await fetch('/api.json')).json();
        this.tableData = users;
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
