export function formatDateTime (dateString) {

    const date = new Date(dateString);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${month} ${day} ${year} (${hours}:${formattedMinutes}) ${ampm}`;
};