import { NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'octocat'; // Cambiar a tu usuario

export async function GET() {
  try {
    if (!GITHUB_USERNAME) {
      return NextResponse.json(
        { error: 'GITHUB_USERNAME no configurado' },
        { status: 400 }
      );
    }

    const urlBase = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const repos: any[] = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const response = await fetch(`${urlBase}?per_page=${perPage}&page=${page}`, { headers });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const pageRepos = await response.json();
      if (!Array.isArray(pageRepos)) {
        throw new Error('GitHub API returned unexpected data');
      }

      repos.push(...pageRepos);
      if (pageRepos.length < perPage) break;
      page += 1;
    }

    const publicRepos = repos
      .filter((repo: any) => !repo.fork)
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);

    const mappedRepos = await Promise.all(
      publicRepos.map(async (repo: any) => {
        let languages = {} as Record<string, number>;

        try {
          const languagesResponse = await fetch(repo.languages_url, { headers });

          if (languagesResponse.ok) {
            languages = await languagesResponse.json();
          }
        } catch (error) {
          console.error(`Error fetching languages for ${repo.full_name}:`, error);
        }

        return {
          id: repo.id,
          name: repo.name,
          description: repo.description,
          url: repo.homepage || repo.html_url,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          languages,
        };
      })
    );

    return NextResponse.json(mappedRepos);
  } catch (error: any) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Error fetching repositories' },
      { status: 500 }
    );
  }
}
