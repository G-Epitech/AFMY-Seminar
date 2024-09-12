//
//  ContentView.swift
//  SoulConnection
//
//  Created by Matheo Coquet on 10/09/2024.
//

import SwiftUI

struct AppContentView: View {
    private var defaults = UserDefaults.init()
    @State private var token: String?

    var body: some View {
        Group {
            if (token != nil) {
                CustomersView(token: token!)
            } else {
                LoginView(token: $token)
            }
        }.task {
            self.token = defaults.string(forKey: "accessToken")
        }
    }
}

#Preview() {
    AppContentView()
}
