package com.example.bezzy.model;

import java.util.List;

public class BezierRequest {
    private List<Point> points;

    public BezierRequest() {
    }

    public BezierRequest(List<Point> points) {
        this.points = points;
    }

    public List<Point> getPoints() {
        return this.points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }
}