const params = new URLSearchParams(window.location.search);
const word = params.get("word");
console.log(word)

fetch("master.json")
    .then(response => response.json())
    .then(data => {
        let pos = null;
        let def = null;
        let sentence = null;
        pos = data[word]["part_of_speech"];
        def = data[word]["definition"];
        sentence = data[word]["used_in_sentence"];

        if (typeof data[word] !== "undefined") {
            console.log(word)
            document.getElementById("word").textContent = word;
            document.getElementById("pos").textContent = `(${pos})`;
            document.getElementById("definition").textContent = `${def}`;
            document.getElementById("sentence").textContent = `${sentence}`;
            document.getElementById("title").textContent = `Goofy Ahhh Dictionary | ${word}`;

            // Dynamically set image
            let img = document.getElementById("wordImage");
            img.src = `Photos/${word}.png`; // Assumes images are named exactly like words
            img.style.display = "block"; // Show image if found
        } else{
            document.body.innerHTML = "<h1>Word not found!</h1><a href='index.html'>Back</a>";
        }
    })
    // .catch(error => console.error("Error loading word:", error));
