import {
    CKAN,
    DatasetSearchForm,
    ListOfDatasets,
    PackageSearchOptions,
    Organization,
    Group,
  } from '@portaljs/ckan';
  import getConfig from 'next/config';
  import { useState } from 'react';
  
  const backend_url = getConfig().publicRuntimeConfig.DMS;
  
  export async function getServerSideProps() {
    const ckan = new CKAN(backend_url);
    const groups = await ckan.getGroupsWithDetails();
    const orgs = await ckan.getOrgsWithDetails();
    return {
      props: {
        groups,
        orgs,
      },
    };
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Datasets", href: "/dataset" },
    { name: "Data Story", href: "/stories/case_1" },
  ];
  
  export default function Home({
    orgs,
    groups,
  }: {
    orgs: Organization[];
    groups: Group[];
  }) {
    const ckan = new CKAN(backend_url);
    const [options, setOptions] = useState<PackageSearchOptions>({
      offset: 0,
      limit: 5,
      tags: [],
      groups: [],
      orgs: [],
    });
  
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
        <DatasetSearchForm
          options={options}
          setOptions={setOptions}
          groups={groups}
          orgs={orgs}
        />
        <div className="bg-white p-8 my-4 rounded-lg">
          <ListOfDatasets options={options} setOptions={setOptions} ckan={ckan} />{' '}
        </div>
      </main>
    );
  }
  