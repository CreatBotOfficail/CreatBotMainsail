import service from './services';

export const getDownloadLog = async (url: string): Promise<void> => {
    try {
        const response = await service.get(url);
        if (response) {
            let urls = JSON.stringify(response.data)
            const blob = new Blob([JSON.parse(urls)], { type: 'text/plain' });
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            let time = getDateTime()
            link.download = `${time}.log`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(objectUrl);
            document.body.removeChild(link);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
};

export const getDownloadZip = async (url: string, filename?: string): Promise<void> => {
    try {
        const response = await service.get(url, { responseType: 'blob' });
        if (response) {
            let type = 'application/zip'
            if (filename) {
                let index = filename.lastIndexOf('.')
                if (index !== -1) {
                    type = 'application/' + filename.substring(index + 1)
                }
            }
            const blob = new Blob([response.data], { type: type });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            if (filename) {
                link.setAttribute('download', filename);
            } else {
                let time = getDateTime()
                link.setAttribute('download', `${time}`);
            }
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
}

//获取当前时间
function getDateTime() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
