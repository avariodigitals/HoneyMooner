export async function getRankMathSEO(url: string) {
  try {
    const res = await fetch(
      `https://cms.thehoneymoonertravel.com/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(url)}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.head || null;
  } catch (error) {
    console.log('SEO fetch error:', error);
    return null;
  }
}