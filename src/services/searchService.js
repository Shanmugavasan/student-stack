// src/services/searchService.js
export const globalSearch = (query, dataSources) => {
  const q = query.toLowerCase();
  
  return {
    jobs: dataSources.jobs.filter(j => 
      j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q)
    ),
    blogs: dataSources.blogs.filter(b => 
      b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)
    ),
    tools: dataSources.tools.filter(t => 
      t.name.toLowerCase().includes(q)
    )
  };
};