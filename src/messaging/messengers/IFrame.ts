import { Message } from "../messages/types/Message";
import { MessageFactory } from "./MessageFactory";
import { ChatMessage } from "../messages/ChatMessage";
import { JoinMessage } from "../messages/JoinMessage";
import { LinkMessage } from "../messages/LinkMessage";
import { MediaMessage } from "../messages/MediaMessage";
import { NotyfMessage } from "../messages/NotyfMessage";
import { StateMessage } from "../messages/VideoStateMessage";

class IFrame {
  // Message Factory
  public messaging!: MessageFactory;
  // Form elements
  public forms!: string[];
  public results!: HTMLElement | null;
  public msgType!: HTMLElement | null;
  public chatBtn!: HTMLElement | null;
  public joinBtn!: HTMLElement | null;
  public linkBtn!: HTMLElement | null;
  public mediaBtn!: HTMLElement | null;
  public notyfBtn!: HTMLElement | null;
  public stateBtn!: HTMLElement | null;

  constructor() {
    console.log("IFrame constructor called!");
    window.addEventListener("load", this.init.bind(this));
  }

  init() {
    // Create Message Factory
    console.log("IFrame init() called!");
    this.messaging = new MessageFactory();

    // Form sections element selectors
    this.forms = ["chat", "link", "join", "media", "notyf", "state"];

    // Create form buttons eventlisteners & bind them to respective functions
    this.msgType = document.getElementById("message-type");
    if (this.msgType) {
      this.msgType.addEventListener("change", this.handleFormChange.bind(this));
    } else {
      console.log("Child: couldn't find message-type!");
    }

    this.chatBtn = document.getElementById("chat-btn");
    if (this.chatBtn) {
      this.chatBtn.addEventListener("click", this.createChat.bind(this));
    } else {
      console.log("Child: couldn't find chat-btn!");
    }

    this.joinBtn = document.getElementById("join-btn");
    if (this.joinBtn) {
      this.joinBtn.addEventListener("click", this.createJoin.bind(this));
    } else {
      console.log("Child: couldn't find join-btn!");
    }

    this.linkBtn = document.getElementById("link-btn");
    if (this.linkBtn) {
      this.linkBtn.addEventListener("click", this.createLink.bind(this));
    } else {
      console.log("Child: couldn't find link-btn!");
    }

    this.mediaBtn = document.getElementById("media-btn");
    if (this.mediaBtn) {
      this.mediaBtn.addEventListener("click", this.createMedia.bind(this));
    } else {
      console.log("Child: couldn't find media-btn!");
    }

    this.notyfBtn = document.getElementById("notyf-btn");
    if (this.notyfBtn) {
      this.notyfBtn.addEventListener("click", this.createNotyf.bind(this));
    } else {
      console.log("Child: couldn't find notyf-btn!");
    }

    this.stateBtn = document.getElementById("state-btn");
    if (this.stateBtn) {
      this.stateBtn.addEventListener("click", this.createState.bind(this));
    } else {
      console.log("Child: couldn't find state-btn!");
    }

    // Listen to messages & bind them to reciever method
    window.addEventListener("message", this.receiver.bind(this));
    this.results = document.getElementById("results");
  }

  // Send message to parent
  sender(msg: any) {
    this.msgLogger(msg, "iFrame sender()");
    window.parent.postMessage(msg, "*");
  }

  // Handle received message
  receiver(msg: any) {
    // Ignore none-JellyParty messages
    if (msg.data.context === "JellyParty") {
      this.msgLogger(msg, "iFrame receiver()");
      // Handle the message based on its type
      switch (msg.data.type) {
        case "chat":
          return this.showChat(msg.data);
        case "join":
          return this.showJoin(msg.data);
        case "link":
          return this.showLink(msg.data);
        case "media":
          return this.showMedia(msg.data);
        case "notyf":
          return this.showNotyf(msg.data);
        case "state":
          return this.showState(msg.data);
      }
    }
  }

  // Create ChatMessage
  createChat() {
    // Create ChatMessage with user form values & send it
    const message: string = this.getFieldValue("chat-message");
    const msg: ChatMessage = this.messaging.chat(message);
    this.msgLogger(msg, "iFrame createChat()");
    this.sender(msg);
  }

  // Create JoinMessage
  createJoin() {
    // Create JoinMessage with user form values & send it
    const party: string = this.getFieldValue("join-party");
    const msg: Message = this.messaging.join(party);
    this.msgLogger(msg, "iFrame createJoin()");
    this.sender(msg);
  }

  // Create LinkMessage
  createLink() {
    // Create LinkMessage with user form values & send it
    const link: string = this.getFieldValue("link-link");
    const msg: Message = this.messaging.link(link);
    this.msgLogger(msg, "iFrame createLink()");
    this.sender(msg);
  }

  // Create MediaMessage
  createMedia() {
    // Create MediaMessage with user form values & send it
    const event: string = this.getFieldValue("media-event").toLowerCase();
    const tick: number = parseInt(this.getFieldValue("media-tick"), 10);
    const msg: Message = this.messaging.media(event, tick);
    this.msgLogger(msg, "iFrame createMedia()");
    this.sender(msg);
  }

  // Create NotyfMessage
  createNotyf() {
    // Create NotyfMessage with user form values & send it
    const message: string = this.getFieldValue("notyf-message");
    const msg: Message = this.messaging.notyf(message);
    this.msgLogger(msg, "iFrame createNotyf()");
    this.sender(msg);
  }

  // Create StateMessage
  createState() {
    // Create StateMessage with user form values & send it
    const paused: boolean = this.getFieldValue("state-paused") === "true";
    const tick: number = parseInt(this.getFieldValue("state-tick"), 10);
    const msg: Message = this.messaging.state(paused, tick);
    this.msgLogger(msg, "iFrame createState()");
    this.sender(msg);
  }

  // Show messages
  showChat(msg: ChatMessage) {
    // Show ChatMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      Message: ${msg.message},<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showChat() -> Results element could not found!",
      );
    }
  }

  showJoin(msg: JoinMessage) {
    // Show JoinMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      Party Id: ${msg.party},<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showJoin() -> Results element could not found!",
      );
    }
  }

  showLink(msg: LinkMessage) {
    // Show LinkMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      BaseLink: ${msg.link},<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showLink() -> Results element could not found!",
      );
    }
  }

  showMedia(msg: MediaMessage) {
    // Show MediaMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      Event: ${msg.event},<br>
      Tick: ${msg.tick}<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showMedia() -> Results element could not found!",
      );
    }
  }

  showNotyf(msg: NotyfMessage) {
    // Show NotyfMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      Message: ${msg.message},<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showNotyf() -> Results element could not found!",
      );
    }
  }

  showState(msg: StateMessage) {
    // Show StateMessage details
    if (this.results) {
      this.results.innerHTML = `
      <p id="message">
      Context: ${msg.context},<br>
      Type: ${msg.type},<br>
      Paused: ${msg.paused},<br>
      Tick: ${msg.tick}<br></p>`;
    } else {
      console.log(
        "ERROR: iFrame showState() -> Results element could not found!",
      );
    }
  }

  // Get HTMLElement value
  getFieldValue(field: string): string {
    // Return an HTMLInputElement's vlaue provided its name
    const fieldValue = (document.getElementById(field) as HTMLInputElement)
      .value;
    return fieldValue;
  }

  // Dynamic Form
  hideForms() {
    // Hide all the forms listed in the forms array
    this.forms.forEach(form => this.hideForm(form));
  }

  hideForm(name: string) {
    // Change a form's visibility provided it's id
    const element = document.getElementById(name);
    if (element) {
      if (element.classList.contains("vissible")) {
        element.classList.remove("vissible");
      }
      element.classList.add("hidden");
    }
  }

  showForm(name: string) {
    // Hide any visible forms
    this.hideForms();
    // Show id provided form
    const element = document.getElementById(name);
    if (element) {
      if (element.classList.contains("hidden")) {
        element.classList.remove("hidden");
      }
      element.classList.add("vissible");
    }
  }

  handleFormChange() {
    // Get new user selected value for messaage-type
    const newType = this.getFieldValue("message-type");
    // Update form to show its relevant form fields
    switch (newType) {
      case "chat":
        return this.showForm("chat");
      case "join":
        return this.showForm("join");
      case "link":
        return this.showForm("link");
      case "media":
        return this.showForm("media");
      case "notyf":
        return this.showForm("notyf");
      case "state":
        return this.showForm("state");
    }
  }

  // Log information about object
  msgLogger(msg: any, from: string) {
    try {
      console.log(from + " -> msg: " + msg);
    } catch {
      console.log("ERROR: " + from + " -> msgLogger couldn't show msg!");
    }

    try {
      console.log(from + " -> typeof msg: " + typeof msg);
    } catch {
      console.log("ERROR: " + from + " -> msgLogger couldn't show msg!");
    }

    try {
      console.log(from + " -> JSON.stringify(msg): " + JSON.stringify(msg));
    } catch {
      console.log(
        "ERROR: " + from + " -> msgLogger couldn't show JSON.stringify(msg)!",
      );
    }

    try {
      console.log(from + " -> msg.type: " + msg.type);
    } catch {
      console.log("ERROR: " + from + " -> msgLogger couldn't show msg.type!");
    }
  }
}

export const child = new IFrame();
