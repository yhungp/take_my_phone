export async function callForFiles(setListFiles, dev, path) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path })
    };

    const response = await fetch('http://localhost:8080/list-files/', requestOptions);
    const data = await response.json();

    var files = []
    var folders = []

    for (var datum in data) {
        if (data[datum]['path'] === "."){
            continue
        }

        if (data[datum]['type'] === 0){
            folders.push(
                [
                    data[datum]['type'],
                    data[datum]['path'],
                    data[datum]['size'],
                ]
            )
            continue
        }

        files.push(
            [
                data[datum]['type'],
                data[datum]['path'],
                data[datum]['size'],
            ]
        )
    }

    setListFiles([...folders, ...files])
}