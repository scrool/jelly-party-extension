<template>
  <div id="wrapper" :class="{ darkMode: darkMode }">
    <SidebarHeader />
    <Tabs v-if="!(connectingToServer || connectedToServer)" />
    <div
      v-if="connectingToServer"
      style="display:flex; align-items:center; justify-content:center;"
    >
      <div>
        <h3 class="text-center">Joining your awesome party..</h3>
        <div class="text-center">
          <b-spinner
            style="width: 3rem; height: 3rem;"
            variant="warning"
            type="grow"
            label="Spinning"
          ></b-spinner>
        </div>
      </div>
    </div>
    <PartyView />
  </div>
</template>

<script>
import SidebarHeader from "../components/SidebarHeader.vue";
import Tabs from "./Tabs.vue";
import PartyView from "@/apps/sidebar/Vue-IFrame/components/PartyView";
import { mapState } from "vuex";

export default {
  name: "SideBar",
  components: {
    SidebarHeader,
    PartyView,
    Tabs,
  },
  computed: {
    ...mapState("options", ["darkMode"]),
    ...mapState(["connectingToServer", "connectedToServer"]),
  },
  mounted: function() {
    this.$store.dispatch("options/populateOptionsStateFromBrowserLocalStorage");
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

:root {
  --jelly-party-sidebar-width: 350px;
  --scrollbarBG: #f5f5f5;
  --thumbBG: #555;
}
@mixin scrollbars() {
  // For Google Chrome
  &::-webkit-scrollbar {
    width: 9px;
    background-color: var(--scrollbarBG);
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
  &::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--scrollbarBG);
  }
}
body {
  color: white !important;
  @include scrollbars();
}
#chatMessagesContainer {
  @include scrollbars();
}
#jellyPartyTabsContainer {
  @include scrollbars();
}
#wrapper {
  background: linear-gradient(
    to right bottom,
    darken(rgb(255, 148, 148), 10%) 0%,
    darken(rgb(238, 100, 246), 10%) 100%
  );
  height: 100vh;
  transition: background-color 300ms ease;
  display: flex;
  flex-direction: column;
  margin-left: auto; // for displaying chrome-extension://...
  overflow: hidden;
}

.darkMode {
  background: black !important;
}

a {
  text-decoration: none !important;
}

:focus {
  outline: none !important;
}

.nav-tabs .nav-link {
  border: none;
  color: white;
}
</style>
