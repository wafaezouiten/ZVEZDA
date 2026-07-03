import React, { useState } from "react";
import { Collapse, Card, Accordion } from "react-bootstrap";
import { Link } from "react-router-dom";


const FAQs = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleAnswer = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div>
      <h2 className="text-center mb-4 display-4 text-primary">Frequently Asked Questions</h2>
      <p className="text-center lead mb-5">Find answers to common questions about our products and services</p>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="mb-5">
            <h3 className="mb-4 pb-2 border-bottom border-primary">
              <i className="bi bi-question-circle-fill me-2 text-primary"></i>
              General Questions
            </h3>

            <Accordion defaultActiveKey="0" flush>
              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(1)}
                  className={`py-3 ${openQuestion === 1 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">How do I place an order?</strong>
                    <i className={`bi fs-4 ${openQuestion === 1 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 1}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">You can place an order by selecting the products you wish to purchase, adding them to your cart, and proceeding to checkout. Our intuitive interface guides you through each step of the process.</p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>

              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(2)}
                  className={`py-3 ${openQuestion === 2 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">Can I change my order after it's placed?</strong>
                    <i className={`bi fs-4 ${openQuestion === 2 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 2}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">Once your order has been placed, it cannot be modified. If you have any issues, please contact our customer support team immediately and we'll do our best to assist you.</p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>

              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(3)}
                  className={`py-3 ${openQuestion === 3 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">How do I track my order?</strong>
                    <i className={`bi fs-4 ${openQuestion === 3 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 3}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">
                        You can also track the status of your order by visiting the Order History page in your account.
                        The status will be updated as your order progresses — such as <strong>"Confirmed"</strong>, <strong>"In Progress"</strong>, and <strong>"Delivered"</strong>.
                      </p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>


              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(4)}
                  className={`py-3 ${openQuestion === 4 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">What payment methods do you accept?</strong>
                    <i className={`bi fs-4 ${openQuestion === 4 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 4}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">For now, we only accept payment upon delivery. All payments are processed securely at the time of delivery.</p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>
            </Accordion>
          </div>

          <div className="mb-5">
            <h3 className="mb-4 pb-2 border-bottom border-primary">
              <i className="bi bi-box-seam-fill me-2 text-primary"></i>
              Product-Related Questions
            </h3>

            <Accordion defaultActiveKey="0" flush>
              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(5)}
                  className={`py-3 ${openQuestion === 5 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">What if an item is out of stock?</strong>
                    <i className={`bi fs-4 ${openQuestion === 5 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 5}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">If an item is out of stock, you'll see a notification on the product page. You can sign up to receive an email notification when it's back in stock, or browse our similar products that might meet your needs.</p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>

              <Card className="mb-3 shadow-sm">
                <Card.Header
                  onClick={() => toggleAnswer(6)}
                  className={`py-3 ${openQuestion === 6 ? 'bg-light' : ''}`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="h5 mb-0">How do I know the correct size for my order?</strong>
                    <i className={`bi fs-4 ${openQuestion === 6 ? "bi-chevron-up" : "bi-chevron-down"}`} />
                  </div>
                </Card.Header>
                <Collapse in={openQuestion === 6}>
                  <div>
                    <Card.Body className="py-3">
                      <p className="mb-0">We provide a detailed size guide with measurements on each product page. For clothing items, we also include model measurements and what size they're wearing in the photos. If you need further assistance, our customer service team is happy to help.</p>
                    </Card.Body>
                  </div>
                </Collapse>
              </Card>
            </Accordion>
          </div>

          <div className="text-center mt-5">
            <div className="card bg-light border-0 p-4">
              <h4 className="mb-3">Still have questions?</h4>
              <p className="mb-4">Can't find the answer you're looking for? Our team is happy to help!</p>
              <Link to="/contact" className="btn btn-dark" >
                Contact Us
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;