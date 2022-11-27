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
import { Component, Vue, Watch } from 'vue-property-decorator';

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

enum URLSearchParamsEnum {
    Search = 'search',
    Page = 'page',
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
    private readonly URLSearchParams: URLSearchParams = new URLSearchParams(window.location.search);

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

    private updateURLSearch() {
        const newRelativePathQuery = window.location.pathname + '?' + this.URLSearchParams.toString();
        history.pushState(null, '', newRelativePathQuery);
    }

    @Watch('currentPage')
    private onCurrentPageChanged() {
        this.URLSearchParams.set(URLSearchParamsEnum.Page, this.currentPage.toString());
        this.updateURLSearch();
    }

    @Watch('searchText')
    private onSearchTextChanged() {
        this.URLSearchParams.set(URLSearchParamsEnum.Search, this.searchText);
        this.updateURLSearch();
    }

    private parseQueryFilters() {
        const page = this.URLSearchParams.get(URLSearchParamsEnum.Page);
        if (page) this.currentPage = parseInt(page);

        const search = this.URLSearchParams.get(URLSearchParamsEnum.Search);
        if (search) this.searchText = search;
    }

    private async fetchTableData() {
        const { results: users }: { results: User[] } = await (await fetch('/api.json').catch((e) => e)).json();
        return users;
    }

    private async created() {
        this.parseQueryFilters();
        this.tableData = await this.fetchTableData();
    }
}
</script>

<style lang="scss">
#app {
    padding: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
