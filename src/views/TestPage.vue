<template>
  <div style="padding: 20px; text-align: center">
    <h1>Test Page</h1>
    <p>If you can see this, Vue is working!</p>
    <p>Current time: {{ new Date().toLocaleString() }}</p>
  </div>
</template>

<script>
  export default {
    name: 'TestPage',
  }
</script>
