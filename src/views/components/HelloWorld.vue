<script>
  export default {
    props: {
      msg: {
        type: String,
        default: "",
      },
    },
    data() {
      return {
        count: 0,
      };
    },
  };
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>

    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
      <p>
        Edit
        <code>components/HelloWorld.vue</code> to test HMR
      </p>
    </div>

    <p>
      Check out
      <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
      starter
    </p>
    <p>
      Install
      <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
      in your IDE for a better DX
    </p>
    <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  </div>
</template>

<style scoped>
  .read-the-docs {
    color: #888;
  }

  button {
    padding: 0.6em 1.2em;
    font-family: inherit;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 8px;
    transition: border-color 0.25s;
  }

  button:hover {
    border-color: #646cff;
  }

  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>
