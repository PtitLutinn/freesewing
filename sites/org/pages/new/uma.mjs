/*
 * This page is auto-generated. Do not edit it by hand.
 */
import { Uma } from 'designs/uma/src/index.mjs'
// Dependencies
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { nsMerge } from 'shared/utils.mjs'
import { workbenchInlineDocs } from 'shared/mdx/docs.mjs'
// Components
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'
import { Workbench, ns as wbNs } from 'shared/components/workbench/new.mjs'
import { WorkbenchLayout } from 'site/components/layouts/workbench.mjs'

// Translation namespaces used on this page
const ns = nsMerge('uma', wbNs, pageNs)

const NewUmaPage = ({ page, docs }) => (
  <PageWrapper {...page} title="Uma" layout={WorkbenchLayout} header={null}>
    <Workbench
      {...{
        design: 'uma',
        Design: Uma,
        docs,
      }}
    />
  </PageWrapper>
)

export default NewUmaPage

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ns)),
      docs: await workbenchInlineDocs({
        Design: Uma,
        design: 'uma',
        locale,
      }),
      page: {
        locale,
        path: ['new', 'uma'],
        title: 'Uma',
      },
    },
  }
}