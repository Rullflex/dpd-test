<template>
    <div id="app">
        <VPagination v-model="currentPage" :max="paginationMax"></VPagination>

        <input v-model="searchText" type="text" />

        <table>
            <thead>
                <tr>
                    <th>Avatar</th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Name)">
                        Full name
                    </th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Gender)">
                        Gender
                    </th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Country)">
                        Country
                    </th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Date)">
                        Birth date
                    </th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Email)">
                        Email
                    </th>
                    <th class="users-table__head-cell--clickable" @click="setSortingType(SortingTypeEnum.Phone)">
                        Phone number
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="row in currentPageTableData" :key="row.id">
                    <td><img :src="row.picture" alt="" /></td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.gender }}</td>
                    <td>{{ row.country }}</td>
                    <td>{{ row.date }}</td>
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
import { chunk, pick, sortBy } from 'lodash';
import hasSearch from '@/core/utils/HasSearch';
import formatDate from '@/core/utils/FormatDate';

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
    Sort = 'sort',
}

enum SortingTypeEnum {
    Name = 'name',
    Gender = 'gender',
    Country = 'country',
    Date = 'date',
    Email = 'email',
    Phone = 'phone',
}

const PAGINATION_SIZE = 20;

@Component({
    components: {
        VPagination,
    },
})
export default class App extends Vue {
    private readonly URLSearchParams: URLSearchParams = new URLSearchParams(window.location.search);
    private readonly SortingTypeEnum = SortingTypeEnum;

    private tableData: User[] = [];
    private currentPage = 1;
    private searchText = '';
    private sortingType: SortingTypeEnum | null = null;

    private get transformedTableData(): TableRow[] {
        return this.tableData.map((user) => {
            return {
                id: user.registered.date,
                picture: user.picture.medium,
                name: user.name.first + ' ' + user.name.last,
                gender: user.gender,
                country: user.location.country,
                date: formatDate(user.dob.date),
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

    private get sortedTableData(): TableRow[] {
        return this.sortingType ? sortBy(this.filteredTableData, this.sortingType) : this.filteredTableData;
    }

    private get chunkedTableData(): TableRow[][] {
        return chunk(this.sortedTableData, PAGINATION_SIZE);
    }

    private get currentPageTableData(): TableRow[] {
        return this.chunkedTableData[this.currentPage - 1];
    }

    private get paginationMax(): number {
        return this.chunkedTableData.length;
    }

    private setSortingType(type: SortingTypeEnum) {
        this.sortingType = type;
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

    @Watch('sortingType')
    private onSortingTypeChanged() {
        if (!this.sortingType) return;
        this.URLSearchParams.set(URLSearchParamsEnum.Sort, this.sortingType);
        this.updateURLSearch();
    }

    private parseQueryFilters() {
        const pageParam = this.URLSearchParams.get(URLSearchParamsEnum.Page);
        if (pageParam) this.currentPage = parseInt(pageParam);

        const searchParam = this.URLSearchParams.get(URLSearchParamsEnum.Search);
        if (searchParam) this.searchText = searchParam;

        const sortParam = this.URLSearchParams.get(URLSearchParamsEnum.Sort);
        const querySortingType = Object.values(SortingTypeEnum).find((el) => el === sortParam);
        if (querySortingType) this.sortingType = querySortingType;
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

.users-table {
    &__head-cell {
        &--clickable {
            cursor: pointer;
        }
    }
}
</style>
