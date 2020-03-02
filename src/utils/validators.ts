const dateCheck = (text: string) => /^\d{1,2}\-\d{1,2}\-\d{4}$/.test(text);
const hourCheck = (text: string) => /^\d{1,2}\:\d{2}$/.test(text);

export const dateValidator = (value: string) => {
    if (dateCheck(value)) {
        const data = value.split('-');
        return (parseInt(data[0]) < 30 && parseInt(data[1]) < 12);
    }
    return false;
};

export const hourValidator = (value: string) => {
    if (hourCheck(value)) {
        const data = value.split(':');
        return (parseInt(data[0]) <= 60  && parseInt(data[1]) <= 60);
    }
    return false;
};
