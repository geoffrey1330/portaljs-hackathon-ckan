import { existsSync, promises as fs } from 'fs';
import path from 'path';
import parse from '../../lib/markdown';

import DataRichDocument from '../../components/DataRichDocument';
import clientPromise from '../../lib/mddb';
import getConfig from 'next/config';
import { CKAN } from '@portaljs/ckan';

export const getStaticPaths = async () => {
  const contentDir = path.join(process.cwd(), '/content/');
  const contentFolders = await fs.readdir(contentDir, 'utf8');
  const paths = contentFolders.map((folder: string) => ({
    params: { path: [folder.split('.')[0]] },
  }));
  return {
    paths,
    fallback: false,
  };
};

const backend_url = getConfig().publicRuntimeConfig.DMS;

export const getStaticProps = async (context) => {
  const mddb = await clientPromise;
  const storyFile = await mddb.getFileByUrl(context.params.path);
  const md = await fs.readFile(
    `${process.cwd()}/${storyFile.file_path}`,
    'utf8'
  );

  const ckan = new CKAN(backend_url);
  const datasets = storyFile.metadata.datasets ? await Promise.all(
    storyFile.metadata.datasets.map(
      async (datasetName: string) => await ckan.getDatasetDetails(datasetName)
    )
  ) : [];
  const orgs = storyFile.metadata.orgs ? await Promise.all(
    storyFile.metadata.orgs.map(
      async (orgName: string) => await ckan.getOrgDetails(orgName)
    )
  ) : [];

  let { mdxSource, frontMatter } = await parse(md, '.mdx', { datasets, orgs });

  return {
    props: {
      mdxSource,
      frontMatter: JSON.stringify(frontMatter),
    },
  };
};

const navigation = [
  { name: "Home", href: "/" },
  { name: "Datasets", href: "/dataset" },
  { name: "Data Story", href: "/stories/case_1" },
];

export default function DatasetPage({ mdxSource, frontMatter }) {
  frontMatter = JSON.parse(frontMatter);
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-sky-100">
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center p-6 lg:px-8" aria-label="Global">
        <div className="flex flex-1 justify-center lg:gap-x-10">
            {navigation.map((item) => (
            <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
            >
                {item.name}
            </a>
            ))}
        </div>
      </nav>
      </header>
      <div className="bg-white p-8 my-4 rounded-lg">
        <div className="prose mx-auto py-8">
          <header>
            <div className="mb-6">
              <>
                <h1 className="mb-2">{frontMatter.title}</h1>
                {frontMatter.author && (
                  <p className="my-0">
                    <span className="font-semibold">Author: </span>
                    <span className="my-0">{frontMatter.author}</span>
                  </p>
                )}
                {frontMatter.description && (
                  <p className="my-0">
                    <span className="font-semibold">Description: </span>
                    <span className="description my-0">
                      {frontMatter.description}
                    </span>
                  </p>
                )}
                {frontMatter.modified && (
                  <p className="my-0">
                    <span className="font-semibold">Modified: </span>
                    <span className="description my-0">
                      {new Date(frontMatter.modified).toLocaleDateString()}
                    </span>
                  </p>
                )}
                {frontMatter.files && (
                  <section className="py-6">
                    <h2 className="mt-0">Data files</h2>
                    <table className="table-auto">
                      <thead>
                        <tr>
                          <th>File</th>
                          <th>Format</th>
                        </tr>
                      </thead>
                      <tbody>
                        {frontMatter.files.map((f) => {
                          const fileName = f.split('/').slice(-1);
                          return (
                            <tr key={`resources-list-${f}`}>
                              <td>
                                <a target="_blank" href={f}>
                                  {fileName}
                                </a>
                              </td>
                              <td>
                                {fileName[0]
                                  .split('.')
                                  .slice(-1)[0]
                                  .toUpperCase()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </section>
                )}
              </>
            </div>
          </header>
          <main>
            <DataRichDocument source={mdxSource} />
          </main>
        </div>
      </div>
    </main>
  );
}
