<template>
    <div id="app">
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

interface Location {
    city: string;
    coordinates: { latitude: string; longitude: string };
    country: string;
    postcode: number;
    state: string;
}

interface User {
    cell: string;
    dob: {
        age: number;
        date: string;
    };
    email: string;
    gender: 'male' | 'female';
    id: {
        name: string;
        value: string;
    };
    location: Location;
    name: {
        first: string;
        last: string;
        title: string;
    };
    nat: string;
    phone: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    registered: {
        age: number;
        date: string;
    };
}

@Component({
    components: {},
})
export default class App extends Vue {
    tableData: User[] = [];

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
