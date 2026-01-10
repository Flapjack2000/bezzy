package com.example.bezzy.controller;

import com.example.bezzy.model.BezierRequest;
import com.example.bezzy.model.Point;
import com.example.bezzy.service.BezierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bezier")
public class BezierController {
    @Autowired
    public BezierService bezierService;

    @PostMapping("/calculate")
    public List<Point> calculateCurve(@RequestBody BezierRequest request) {
        List<Point> controlPoints = request.getPoints();
        return bezierService.calculateBezierCurve(controlPoints);
    }
}