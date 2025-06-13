import { Button, Card, Col, Row, Typography } from "antd";
import React from "react";

const { Title, Text } = Typography;

const ContentSectionion = () => {
  return (
    <div style={{ width: "100%", backgroundColor: "#FFF9E5", padding: "20px" }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title
            level={1}
            style={{ fontFamily: "Godo_B-Regular", color: "#000" }}
          >
            제휴업체
          </Title>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <div
                style={{
                  height: "305px",
                  backgroundImage: "url(/image.png)",
                  backgroundSize: "cover",
                }}
              />
            }
            bordered={false}
          >
            <div style={{ backgroundColor: "#ffffff33", padding: "10px" }}>
              <Title
                level={2}
                style={{ color: "#FFF", textShadow: "4px 4px 4px #000000bf" }}
              >
                인천
              </Title>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                서해앞바다
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                3성급 호텔
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <div
                style={{
                  height: "305px",
                  backgroundImage: "url(/image-2.png)",
                  backgroundSize: "cover",
                }}
              />
            }
            bordered={false}
          >
            <div style={{ backgroundColor: "#ffffff33", padding: "10px" }}>
              <Title
                level={2}
                style={{ color: "#FFF", textShadow: "4px 4px 4px #000000bf" }}
              >
                부산
              </Title>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                광안해수욕장
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                3성급 호텔
              </Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <div
                style={{
                  height: "305px",
                  backgroundImage: "url(/image-3.png)",
                  backgroundSize: "cover",
                }}
              />
            }
            bordered={false}
          >
            <div style={{ backgroundColor: "#ffffff33", padding: "10px" }}>
              <Title
                level={2}
                style={{ color: "#FFF", textShadow: "4px 4px 4px #000000bf" }}
              >
                서울
              </Title>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                동대문프라자
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  textShadow: "4px 4px 4px #000000bf",
                  fontSize: "32px",
                }}
              >
                5성급 호텔
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "50px" }}>
        <Col span={24}>
          <Title
            level={1}
            style={{ fontFamily: "Godo_B-Regular", color: "#000" }}
          >
            인기명소 <Text style={{ fontSize: "24px" }}>(Top10)</Text>
          </Title>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "20px",
              border: "1px solid #eeeeee",
              boxShadow: "4px 4px 4px #00000040",
            }}
          >
            <Row>
              <Col span={10}>
                <img
                  src="/rectangle-31.png"
                  alt="Rectangle"
                  style={{ width: "100%", height: "279px", objectFit: "cover" }}
                />
              </Col>
              <Col span={10} style={{ padding: "20px" }}>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  서울특별시 영등포구 포천동
                </Title>
                <Title
                  level={2}
                  style={{ fontFamily: "Godo_B-Regular", color: "#000" }}
                >
                  포포인츠 알파이 워케이션
                </Title>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  리뷰 (15)
                </Title>
              </Col>
              <Col
                span={4}
                style={{ borderLeft: "2px solid #ffdd38", padding: "20px" }}
              >
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  테마
                </Title>
                <Text
                  style={{
                    fontFamily: "Godo_B-Regular",
                    color: "#000",
                    fontSize: "26px",
                  }}
                >
                  모던스타일 / 도심
                </Text>
                <Button
                  type="primary"
                  style={{ marginTop: "20px", borderRadius: "10px" }}
                >
                  상세 보기
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "20px",
              border: "1px solid #eeeeee",
              boxShadow: "4px 4px 4px #00000040",
            }}
          >
            <Row>
              <Col span={10}>
                <img
                  src="/rectangle-32.png"
                  alt="Rectangle"
                  style={{ width: "100%", height: "279px", objectFit: "cover" }}
                />
              </Col>
              <Col span={10} style={{ padding: "20px" }}>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  경기도 시흥시
                </Title>
                <Title
                  level={2}
                  style={{ fontFamily: "Godo_B-Regular", color: "#000" }}
                >
                  이노테이션 워케이션
                </Title>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  리뷰 (16)
                </Title>
              </Col>
              <Col
                span={4}
                style={{ borderLeft: "2px solid #ffdd38", padding: "20px" }}
              >
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  테마
                </Title>
                <Text
                  style={{
                    fontFamily: "Godo_B-Regular",
                    color: "#000",
                    fontSize: "26px",
                  }}
                >
                  모던 / 자연 퓨젼
                </Text>
                <Button
                  type="primary"
                  style={{ marginTop: "20px", borderRadius: "10px" }}
                >
                  상세 보기
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "20px",
              border: "1px solid #eeeeee",
              boxShadow: "4px 4px 4px #00000040",
            }}
          >
            <Row>
              <Col span={10}>
                <img
                  src="/rectangle-32-2.png"
                  alt="Rectangle"
                  style={{ width: "100%", height: "279px", objectFit: "cover" }}
                />
              </Col>
              <Col span={10} style={{ padding: "20px" }}>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  경기도 시흥시
                </Title>
                <Title
                  level={2}
                  style={{ fontFamily: "Godo_B-Regular", color: "#000" }}
                >
                  이노테이션 워케이션
                </Title>
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  리뷰 (16)
                </Title>
              </Col>
              <Col
                span={4}
                style={{ borderLeft: "2px solid #ffdd38", padding: "20px" }}
              >
                <Title
                  level={4}
                  style={{
                    fontFamily: "GyeonggiTitleOTF-Medium",
                    color: "#000",
                  }}
                >
                  테마
                </Title>
                <Text
                  style={{
                    fontFamily: "Godo_B-Regular",
                    color: "#000",
                    fontSize: "26px",
                  }}
                >
                  모던 / 자연 퓨젼
                </Text>
                <Button
                  type="primary"
                  style={{ marginTop: "20px", borderRadius: "10px" }}
                >
                  상세 보기
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContentSectionion;
