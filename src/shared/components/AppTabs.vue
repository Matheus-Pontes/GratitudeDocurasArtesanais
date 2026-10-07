<script setup>

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import TruffleList from '@/features/truffles/components/TruffleList.vue'
import ComboList from '@/features/combos/components/ComboList.vue'
import Gift from '../../features/gifts/components/Gift.vue';
</script>

<template>
    <Tabs value="0">
        <TabList>
          <Tab value="0">Trufas</Tab>
          <Tab value="1">Combos</Tab>
          <Tab value="2">Presentear</Tab>
          <Tab value="3">Eventos/Festas</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <TruffleList />
          </TabPanel>
          <TabPanel value="1">
            <ComboList />
          </TabPanel>
          <TabPanel value="2">
            <Gift />
          </TabPanel>
          <TabPanel value="3">
            <Party />
          </TabPanel>
        </TabPanels>
    </Tabs>
</template>