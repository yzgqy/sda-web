import Vue from 'vue'
import Router from 'vue-router'
import AppList from '../views/menu/AppList.vue'
import ArchivedAppList from '../views/menu/ArchivedAppList.vue'
import StarredAppList from '../views/menu/StarredAppList.vue'
import TaskList from '../views/menu/TaskList.vue'
import Guide from '../views/menu/Guide.vue'
import InfoCollectionList from '../views/InfoCollectionList.vue'
import AppDetail from '../views/AppDetail.vue'
import PartitionList from '../views/PartitionList.vue'
import EvaluationAnalysis from '../views/EvaluationAnalysis.vue'
import AppTasks from '../views/AppTasks.vue'
import PartitionDetailCard from '../views/partition/PartitionDetailCard-1.vue'
import PartitionListCard from '../views/partition/PartitionListCard.vue'
import InfoCollectionListCard from '../views/infoCollection/InfoCollectionListCard.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/apps',
      component: AppList,
    },
    {
      path: '/apps/:appid',
      component: AppDetail,
      children: [
        {
          path: 'info',
          component: InfoCollectionList,
          children: [
            {
              path: 'list',
              component: InfoCollectionListCard,
            }
          ]
        },
        {
          path: 'partition',
          component: PartitionList,
          children: [
            {
              path: 'list',
              component: PartitionListCard,
            },
            {
              path: 'detail/:partitionId',
              component: PartitionDetailCard,
            }
          ]
        },
        {
          path: 'evaluation',
          component: EvaluationAnalysis,
        },
        {
          path: 'tasks',
          component: AppTasks,
        }
      ]
    },
    {
      path: '/star-apps',
      component: StarredAppList
    },
    {
      path: '/star-apps/:appid',
      component: AppDetail,
      children: [
        {
          path: 'info',
          component: InfoCollectionList,
          children: [
            {
              path: 'list',
              component: InfoCollectionListCard,
            }
          ]
        },
        {
          path: 'partition',
          component: PartitionList,
          children: [
            {
              path: 'list',
              component: PartitionListCard,
            },
            {
              path: 'detail/:partitionId',
              component: PartitionDetailCard,
            }
          ]
        },
        {
          path: 'evaluation',
          component: EvaluationAnalysis,
        },
        {
          path: 'tasks',
          component: AppTasks,
        }
      ]
    },
    {
      path: '/archive-apps',
      component: ArchivedAppList
    },
    {
      path: '/archive-apps/:appid',
      component: AppDetail,
      children: [
        {
          path: 'info',
          component: InfoCollectionList,
          children: [
            {
              path: 'list',
              component: InfoCollectionListCard,
            }
          ]
        },
        {
          path: 'partition',
          component: PartitionList,
          children: [
            {
              path: 'list',
              component: PartitionListCard,
            },
            {
              path: 'detail/:partitionId',
              component: PartitionDetailCard,
            }
          ]
        },
        {
          path: 'evaluation',
          component: EvaluationAnalysis,
        },
        {
          path: 'tasks',
          component: AppTasks,
        }
      ]
    },
    {
      path: '/tasks',
      component: TaskList
    },
    {
      path: '/guide',
      component: Guide
    },
    {
      path: '/',
      redirect: '/apps'
    }
  ]
})
