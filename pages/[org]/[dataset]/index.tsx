import Head from "next/head";
import { CKAN, Dataset } from "@portaljs/ckan";
import {
  ChevronRightIcon,
  HomeIcon,
  PaperClipIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import getConfig from "next/config";

const backend_url = getConfig().publicRuntimeConfig.DMS

export const getServerSideProps = async (context: any) => {
  try {
    const datasetName = context.params?.dataset;
    if (!datasetName) {
      return {
        notFound: true,
      };
    }
    const ckan = new CKAN(backend_url);
    const dataset = await ckan.getDatasetDetails(datasetName as string);
    if (!dataset) {
      return {
        notFound: true,
      };
    }
    return {
      props: { dataset },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};

export default function DatasetPage({
  dataset,
}: {
  dataset: Dataset;
}): JSX.Element {
  return (
    <>
      <Head>
        <title>{`${dataset.title || dataset.name} - Dataset`}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-zinc-900">
        <div className="bg-white p-8 my-4 rounded-lg">
          <nav className="flex px-4 py-8" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <div>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <HomeIcon
                      className="h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <span
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    aria-current={"page"}
                  >
                    {dataset.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
          {dataset && (
            <div>
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  {dataset.title || dataset.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                  Dataset details
                </p>
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Title
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {dataset.title}
                    </dd>
                  </div>
                  {dataset.tags && dataset.tags.length > 0 && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Tags
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {dataset.tags.map((tag) => tag.display_name).join(", ")}
                      </dd>
                    </div>
                  )}
                  {dataset.tags && dataset.tags.length > 0 && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        URL
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {dataset.url}
                      </dd>
                    </div>
                  )}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    {dataset.notes && (
                      <>
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                          Description
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                          {dataset.notes}
                        </dd>
                      </>
                    )}
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Files
                    </dt>
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200"
                      >
                        {dataset.resources.map((resource) => (
                          <li key={resource.id} className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                            <div className="flex w-0 flex-1 items-center">
                              <PaperClipIcon
                                className="h-5 w-5 flex-shrink-0 text-gray-400"
                                aria-hidden="true"
                              />
                              <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                <span className="truncate font-medium">
                                  {resource.name || resource.id}
                                </span>
                                <span className="flex-shrink-0 text-gray-400">
                                  {resource.size}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              <a
                                href={resource.url}
                                className="font-medium hover:text-indigo-500 mr-4"
                              >
                                Download
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
