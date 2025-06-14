import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    name: "Electric Motorcycle",
    image:
      "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWMlMjBtb3RvcmN5Y2xlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    link: "/category/motorcycle",
  },
  {
    id: 2,
    name: "Electric Scooter",
    image:
      "https://images.unsplash.com/photo-1601512986351-9b0e01780eef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlY3RyaWMlMjBzY29vdGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    link: "/category/scooter",
  },
  {
    id: 3,
    name: "Electric Light Scooter",
    image:
      "https://images.unsplash.com/photo-1572161957644-4c8f01669098?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZWxlY3RyaWMlMjBzY29vdGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    link: "/category/light-scooter",
  },
  {
    id: 4,
    name: "Electric Tricycle",
    image:
      "https://images.unsplash.com/photo-1567515307865-4c28c2e1d4c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZWxlY3RyaWMlMjB0cmljeWNsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    link: "/category/tricycle",
  },
];

const CategoryCarousel: React.FC = () => {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-600">
            Discover our wide range of electric vehicles
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group relative rounded-2xl overflow-hidden shadow-lg">
              <Link to={category.link}>
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/80 text-sm">Explore →</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
