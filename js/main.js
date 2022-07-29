const themeBlueColor = "#000c24";
const themeWhiteColor = "#928a97";
function setHtml(Selector, HTML) {
    let elem = document.querySelector(Selector);
    if (elem !== null) {
        elem.innerHTML = HTML;
    }
    else {
        console.error("Element not found!!", Selector);
    }
}
function appendHtml(Selector, HTML) {
    let elem = document.querySelector(Selector);
    if (elem !== null) {
        elem.innerHTML += HTML;
    }
    else {
        console.error("Element not found!!", Selector);
    }
}
function setHref(Selector, href) {
    let elem = document.querySelector(Selector);
    if (elem !== null) {
        elem.href = href;
    }
    else {
        console.error("Element not found!!", Selector);
    }
}
function setSrc(Selector, src) {
    let elem = document.querySelector(Selector);
    if (elem !== null) {
        elem.src = src;
    }
    else {
        console.error("Element not found!!", Selector);
    }
}
function setAmountCSS(selector, amt) {
    let elem = document.getElementById(selector);
    if (elem !== null) {
        elem.style.backgroundImage = `conic-gradient(${themeBlueColor} 0deg,${themeBlueColor} ${amt * 360 / 100}deg,${themeWhiteColor} ${amt * 360 / 100}deg)`;
    }
    else {
        console.error("Element not found!!", selector);
    }
}
function setSkiils(data) {
    //here data parameter is an array of objects reresenting skill name and it's percentage
    let finalHtml = "";
    data.forEach(element => {
        //element structure{ name: "name of skill", amount: Number(amount of that skill)}
        finalHtml += ` 
            <li class="uppercase circle-progress" id="${element.name}">
                <span>${element.name}</span>
            </li>`;
        if (element.name.length > 4) {

        }
    });
    setHtml("skill-list", finalHtml);
    data.forEach(element => {
        setAmountCSS(element.name, element.amount);
    });
}
function setHorizontalScroll(container, leftBtnID, rightBtnID) {
    let lft = document.getElementById(leftBtnID);
    let cont = document.querySelector(container);
    if (cont === null) {
        console.error("container not found");
        return;

    }
    if (lft !== null) {
        lft.addEventListener("click", () => {
            let i = 0;
            let id = setInterval(() => {
                cont.scrollLeft -= 30;
                i++;
                if (i == 5) {
                    clearInterval(id);
                }
            }, 50);

        });
    }
    else console.error("Left button not found");
    let rit = document.getElementById(rightBtnID);
    if (rit !== null) {
        rit.addEventListener("click", () => {
            let i = 0;
            let id = setInterval(() => {
                cont.scrollLeft += 30;
                i++;
                if (i == 5) {
                    clearInterval(id);
                }
            }, 50);
        });
    }
    else console.error("right button not found");

}
function getProjectList(username, filterArray) {
    let finalHtml = "";
    fetch(`https://api.github.com/users/${username}/repos`).then(response => {
        if (response.ok) {
            response.json().then(data => {
                data.forEach(async (element) => {
                    //build the object
                    let obj = {
                        name: element.name,
                        stars: element["stargazers_count"],
                        description: null,
                        languages: [],
                        url: element["html_url"]
                    };
                    let is_excluded = false;
                    filterArray.forEach(element => {
                        if (obj.name === element) {
                            is_excluded = true;
                        }
                    });
                    if (is_excluded == true) {
                        return;
                    }
                    if (element.description === null) {
                        obj.description = "No description provided by owner.";
                    }
                    else {
                        obj.description = element.description;
                    }

                    await fetch(element["languages_url"]).then(response => {
                        response.json().then(data => {
                            for (const key in data) {
                                obj.languages.push(key);
                            }
                            finalHtml = `
                    <li class="small-font arial project-card ">
                        <a href="${obj.url}" class=" hide-scrollbar" target="_blank">
                            <img src="media/github-logo.svg" alt="github-link" class="filter">
                        </a>
                        <span>${obj.name}</span>
                        <span class="has-tool-tip uppercase x-small-font pointer">
                            hover for Description
                            <description> ${obj.description}</description>
                        </span>
                        <span>${obj.stars} Stars</span>
                        <span>${obj.languages}</span>
                    </li>`;
                            appendHtml("#works>ul", finalHtml);

                        });
                    });
                });
            });
        }
        else {
            let finalHtml = `<h1> Can't fetch the projects from the github server. Error- response not got-username:${username}</h1>`;
            setHtml("#works>ul", finalHtml);

        }
    });
}
function resetContactForm() {
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-mail").value = "";
    document.getElementById("contact-message").value = "";

}
function validateAndSend() {
    let name = document.getElementById("contact-name");
    if (name !== null) {
        name = name.value;
        if (name === "") {
            resetContactForm();
            return false;
        }
        let mail = document.getElementById("contact-mail");
        if (mail !== null) {
            mail = mail.value;
            if (mail === "") {
                resetContactForm();
                return false;
            }
            let msg = document.getElementById("contact-message");
            if (msg !== null) {
                msg = msg.value;
                if (msg === "") {
                    resetContactForm();
                    return false;
                }
                let obj = {
                    name: name,
                    email: mail,
                    msg: msg
                };
                //! here put your server url which supports the post request
                document.getElementById("send-message-btn").href += `name:${obj.name}%0D%0Acontact-mail:${obj.email}%0D%0Amessage:${obj.msg}`;
                console.log(document.getElementById("send-message-btn").href);
                resetContactForm();
                return true;
            }
            else {
                console.error("cant find the msg box to enter the msg");
                resetContactForm();

                return false;
            }

        }
        else {
            console.error("cant find the mail box to enter the mail");
            resetContactForm();

            return false;
        }
    }
    else {
        console.error("cant find the name box to enter the name");
        resetContactForm();

        return false;
    }
}
let start = () => {
    //fetch data from info.json file
    fetch("js/info.json").then((res) => {
        res.json().then((data) => {
            //the json object is fetched and available as the variable data
            document.title = "Portfolio | " + data.name;
            setHtml("name", data.name);
            setHtml("role", data.role);
            setHref("socialHandles :nth-child(1)", data["twitter-handle"]);
            setHref("socialHandles :nth-child(2)", data["github-handle"]);
            setHref("socialHandles :nth-child(3)", data["linkedin-handle"]);
            setHref("socialHandles :nth-child(4)", data["instagram-handle"]);
            setSrc("profile-picture>img", data["profile-picture"]);
            setHtml("about", data["about-yourself"]);
            setHref("#download-cv-btn>a", data["cv-link"]);
            setHtml("skill-para", data["about-skills"]);
            // set skills with their percentage
            setSkiils(data["skills"]);
            setHorizontalScroll("skill-list", "skills-leftscroll", "skills-rightscroll");
            getProjectList(data["github-username"], data["works-filter"]);
            let sendMsgBtn = document.getElementById("send-message-btn");
            if (sendMsgBtn !== null) {
                sendMsgBtn.href = `mailto:${data["message-email"]}?subject=Testing out mailto!&body=`;
                console.log(sendMsgBtn.href);
            }
            if (sendMsgBtn !== null) {
                sendMsgBtn.addEventListener("click", (e) => {
                    let i = validateAndSend();
                    if (i == false) {
                        e.preventDefault();
                        sendMsgBtn.innerHTML = '<span class="link x-small-font uppercase">Not sent!</span>';
                        setTimeout(() => {
                            sendMsgBtn.innerHTML = '<span class="link x-small-font uppercase">Send message</span>';

                        }, 5000);
                    }
                    else {
                        document.getElementById("contact-name").disabled = true;
                        document.getElementById("contact-mail").disabled = true;
                        document.getElementById("contact-message").disabled = true;
                        sendMsgBtn.innerHTML = '<span class="link x-small-font uppercase">sent successfully!</span>';
                        sendMsgBtn.disabled = true;
                        setTimeout(() => {
                            sendMsgBtn.innerHTML = '<span class="link x-small-font uppercase">Dont send more messages</span>';
                            sendMsgBtn.style.cursor = "not-allowed";
                        }, 3000);
                    }
                });
            }
            else
                console.error("cant find the send message button!");
        });
    });
    //set foldable menu
    let trigger = document.getElementById("menu-trigger");
    trigger.addEventListener("click", () => {
        let list = document.getElementById("nav-list");
        list.toggleAttribute("visible");
        trigger.toggleAttribute("rotate-full");
    });
};
window.addEventListener("load", start);