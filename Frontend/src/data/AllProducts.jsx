const allProducts = [
    {
      id: 1,
      name: 'Classic Hoodie',
      category: 'dresses',
      image: ['image1.jpg', 'image2.jpg'],
      review: 4,
      price: 159.99,
      variants: {
        Black: { S: 3, M: 2, L: 1, XL: 0 },
        Grey: { S: 1, M: 1, L: 5, XL: 2 },
        Red: { S: 2, M: 9, L: 0, XL: 1 },
      },
    },
    {
      id: 2,
      name: 'Denim Jacket',
      category: 'jackets',
      image: ['image2.jpg', 'image1.jpg'],
      review: 5,
      price: 179.99,
      variants: {
        Black: { S: 1, M: 0, L: 7, XL: 1 },
        Grey: { S: 0, M: 1, L: 0, XL: 0 },
        Red: { S: 2, M: 1, L: 3, XL: 0 },
      },
    },
    {
        id: 3,
        name: 'Denim Jacket',
        category: 'jackets',
        image: ['image2.jpg', 'image1.jpg'],
        review: 5,
        price: 179.99,
        variants: {
          Black: { S: 1, M: 0, L: 2, XL: 1 },
          Grey: { S: 0, M: 1, L: 0, XL: 0 },
          Red: { S: 2, M: 1, L: 8, XL: 0 },
        },
      },
  ];
  
  export default allProducts;
  