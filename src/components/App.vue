<template>
<div>
  <strong>App Component</strong>
</div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import localData from '../localData'
const dscc = require('@google/dscc')
  
export default {
  name: 'App',

  setup() {
    const gdsData = ref({})
    let unSubscribe = null

    const subscribe = (data) => {
      console.log(data)
      gdsData.value = data
    }

    onMounted(() => {
      if (typeof DSCC_IS_LOCAL !== 'undefined' && DSCC_IS_LOCAL) {
        subscribe(localData);
      } else {
        unSubscribe = dscc.subscribeToData(subscribe, {transform: dscc.objectTransform});
      }
    })

    onUnmounted(() => {
      if (unSubscribe) {
        unSubscribe()
      }
    })

    return {}
  }
}
</script>

<style lang="scss">
strong {
  color: red;
}
</style>
