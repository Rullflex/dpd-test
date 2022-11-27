import Location from './Location';

export default interface User {
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
