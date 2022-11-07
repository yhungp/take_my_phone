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

export function callForPhotos(setFunction, dev) {
    fetch("http://localhost:8080/list-photos/" + dev)
    .then(res => res.json())
    .then(
      (result) => {
        if (result == null) {
          // setCount((count) => 0)
        }
        else {
          if (result !== "device offline") {
            setFunction(result)
          }
        }
      },
      (error) => {
        // setCount((i) => 0)
      }
    )
}

export function callForMusic(setFunction, dev) {
    fetch("http://localhost:8080/list-musics/" + dev)
    .then(res => res.json())
    .then(
      (result) => {
        if (result == null) {
          // setCount((count) => 0)
        }
        else {
          if (result !== "device offline") {
            setFunction(result)
          }
        }
      },
      (error) => {
        // setCount((i) => 0)
      }
    )
}

export function callForVideos(setFunction, dev) {
    fetch("http://localhost:8080/list-videos/" + dev)
    .then(res => res.json())
    .then(
      (result) => {
        if (result == null) {
          // setCount((count) => 0)
        }
        else {
          if (result !== "device offline") {
            setFunction(result)
          }
        }
      },
      (error) => {
        // setCount((i) => 0)
      }
    )
}