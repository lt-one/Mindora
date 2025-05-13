import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, Clock } from "lucide-react";

// 示例博客文章数据
const postsData = [
  {
    id: "1",
    title: "舆情监测中的AI大模型应用实践",
    slug: "ai-sentiment-analysis",
    excerpt: "探讨如何利用AI大模型提升舆情监测效率，分享实际项目中的提示词工程设计经验和数据处理流程优化方法。",
    featuredImage: "/images/blog/ai-sentiment-analysis.png",
    publishedAt: "2023-12-15",
    readingTime: "8 分钟",
    categories: ["舆情分析"],
    tags: ["AI大模型", "舆情监测", "提示词工程"],
  },
  {
    id: "2",
    title: "脑机接口技术在智能家居中的应用前景",
    slug: "brain-interface-smart-home",
    excerpt: "分享脑机接口项目的研发经验，探讨脑电信号如何实现智能家居控制，以及这一技术在未来生活场景中的潜力。",
    featuredImage: "/images/blog/brain-interface.png",
    publishedAt: "2023-11-20",
    readingTime: "10 分钟",
    categories: ["脑机接口"],
    tags: ["智能家居", "脑电信号", "交互技术"],
  },
  {
    id: "3",
    title: "数据可视化设计：从数字到洞察",
    slug: "data-visualization-design",
    excerpt: "分享数据可视化的设计原则和最佳实践，如何选择合适的图表类型，以及通过视觉设计提升数据理解和决策效率。",
    featuredImage: "/images/blog/data-visualization.png",
    publishedAt: "2023-10-10",
    readingTime: "12 分钟",
    categories: ["数据分析"],
    tags: ["数据可视化", "Tableau", "设计原则"],
  },
  {
    id: "4",
    title: "产品设计中的数据驱动决策",
    slug: "data-driven-product-design",
    excerpt: "如何将数据分析融入产品设计流程，通过舆情数据、用户反馈和市场趋势分析指导产品迭代和功能优化。",
    featuredImage: "/images/blog/product-design.png",
    publishedAt: "2023-09-05",
    readingTime: "7 分钟",
    categories: ["产品设计"],
    tags: ["数据驱动", "用户体验", "产品迭代"],
  },
];

const LatestPosts = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            最新文章
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            分享我在数据分析、AI应用和产品设计领域的见解与经验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {postsData.map((post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow group"
            >
              <Link href={`/blog/${post.slug}`} className="block cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                    {post.categories[0]}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3 space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readingTime}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-800 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            浏览更多文章
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts; 