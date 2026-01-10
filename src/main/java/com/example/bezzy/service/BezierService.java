package com.example.bezzy.service;

import com.example.bezzy.model.Point;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BezierService {
    private int binomialCoefficient(int n, int k) {
        if (k > n - k) {
            k = n - k;
        }
        int result = 1;
        for (int i = 0; i < k; i++) {
            result *= (n - i);
            result /= (i + 1);
        }
        return result;
    }

    private double basis(int i, int n, double t) {
        return binomialCoefficient(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
    }

    public List<Point> calculateBezierCurve(List<Point> controlPoints) {

        int n = controlPoints.size() - 1;
        List<Point> result = new ArrayList<>();

        for (double t = 0.000d; t <= 1.000d; t += 0.001d) {
            double x = 0.000d, y = 0.000d;

            for (int i = 0; i <= n; i++) {
                double basis = basis(i, n, t);
                Point point = controlPoints.get(i);
                x += basis * point.getX();
                y += basis * point.getY();
            }
            result.add(new Point(x, y));
        }
        return result;
    }
}