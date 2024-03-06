export async function readFileToDataURI(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            const result = e?.target?.result
            if (result && typeof result === 'string') {
                resolve(result);
            } else {
                reject(new Error('Error Reading File'));
            }
        };
        reader.onerror = (err: ProgressEvent<FileReader>) => {
            reject(new Error('Error Reading File'));
        };
        reader.readAsDataURL(file);
    });
}

export function formatFileSize(bytes: number): { size: string; unit: string } {
    const div = bytes / 1000000;
    let unit = 'mb';
    let size = div;
    if (div < 1) {
        size = (bytes / 1000);
        unit = 'kb';
    }
    return {
        size: size.toFixed(2).replace('.00', '.0'),
        unit: unit,
    };
}

export function ucFirst(str: string): string {
    if (!str) {
        return '';
    }
    return `${str[0].toUpperCase()}${str.slice(1)}`
}