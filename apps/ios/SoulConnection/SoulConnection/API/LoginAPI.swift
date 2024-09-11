//
//  LoginAPI.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 10/09/2024.
//

import Foundation

struct Response: Codable {
    let tokens: Tokens
}

struct Tokens: Codable {
    let access: String
}

func loginAPI(email: String, password: String) async throws -> Response
{
    guard let url = URL(string: "\(APIConfig.url)/auth/login") else {
        throw URLError(.badURL)
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.timeoutInterval = 20
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body: [String: AnyHashable] = [
        "email": email,
        "password": password
    ]
    request.httpBody = try? JSONSerialization.data(withJSONObject: body, options: .fragmentsAllowed)
    
    let (data, header) = try await URLSession.shared.data(for: request)
    if let httpResponse = header as? HTTPURLResponse {
        let statusCode = httpResponse.statusCode
        
        if statusCode != 200 && statusCode != 201 {
            throw URLError(.dataNotAllowed)
        }
    }
    
    let response = try JSONDecoder().decode(Response.self, from: data)
    return response
}
