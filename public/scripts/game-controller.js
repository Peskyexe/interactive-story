async function getStoryNodes() {
    try {
        const response = await fetch('./story-nodes.json');

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        return data

    } catch (error) {
        console.error('There was an error loading the JSON:', error);
    }
}


async function runNode(node) {
    switch (node.type) {
        case "scene":
            renderScene(node);
            break;

        case "dialogue":
            showDialogue(node);
            break;

        case "choice":
            showChoices(node);
            break;

        case "item_choice":
            showItemSelection(node);
            break;
    }
}


async function loadModuleHTML(moduleName) {
    try {
        const response = await fetch(`./html-modules/${moduleName}.html`);
        if (!response.ok) throw new Error('Failed to load');

        const htmlText = await response.text();
        const moduleHTML = stringToHTML(htmlText);
        return moduleHTML;
    } catch (error) {
        console.error(error);
    }
}

function stringToHTML(text) {
	let parser = new DOMParser();
	let doc = parser.parseFromString(text, 'text/html');
	let element = doc.querySelector('li');

    return element;
}


function renderScene(node) {
    console.log("Rendering scene...");
}

const dialogueContainer = document.getElementById('dialogue-list');

async function showDialogue(node) {
    console.log("Showing dialogue...");

    const dialogueHTML = await loadModuleHTML('dialogue-box');

    dialogueHTML.classList.add('npc-dialogue');
    dialogueHTML.querySelector('.dialogue-speaker-name').innerHTML = node.speaker;
    dialogueHTML.querySelector('.dialogue-speaker-head').src = node.speaker_img_src;
    dialogueHTML.querySelector('.dialogue-speaker-text').innerHTML = node.text;

    dialogueContainer.appendChild(dialogueHTML);
}

const choicesContainer = document.getElementById('dialogue-choices-list');

async function showChoices(node) {
    console.log("Showing dialogue choices...");

    const dialogueChoices = node.options;

    dialogueChoices.forEach(choice => {
        const element = document.createElement('li');
        element.classList.add('dialogue-choice');
        element.innerHTML = choice.text;

        element.addEventListener('click', async (event) => {
            const dialogueHTML = await loadModuleHTML('dialogue-box');

            dialogueHTML.classList.add('player-dialogue');
            dialogueHTML.querySelector('.dialogue-speaker-name').innerHTML = story.player_name;
            dialogueHTML.querySelector('.dialogue-speaker-head').src = story.player_img_src;
            dialogueHTML.querySelector('.dialogue-speaker-text').innerHTML = choice.text;

            dialogueContainer.appendChild(dialogueHTML);            
        }, { once: true });

        choicesContainer.appendChild(element);
    });
}

function showItemSelection(node) {
    console.log("Showing item choices...");
}


const story = await getStoryNodes();
let currentNode = story.nodes[story.start];
let currentScene = story.nodes[story.start];

runNode(currentNode);

const dialogueCooldown = 1000;

document.addEventListener('keydown', (event) => {
    if (event.code === "Space") {
        currentNode = story.nodes[currentNode.next];
        runNode(currentNode);

        setTimeout(() => {}, dialogueCooldown);
    }
});